package com.dropletai.backend.service;

import com.dropletai.backend.dto.BrandDocumentResponse;
import com.dropletai.backend.entity.*;
import com.dropletai.backend.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BrandDocumentService {

    private final BrandDocumentRepository documentRepository;
    private final OrganisationRepository organisationRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    private final Path uploadDir = Paths.get("uploads", "documents").toAbsolutePath().normalize();

    public BrandDocumentService(
            BrandDocumentRepository documentRepository,
            OrganisationRepository organisationRepository,
            BrandRepository brandRepository,
            UserRepository userRepository,
            MembershipRepository membershipRepository
    ) {
        this.documentRepository = documentRepository;
        this.organisationRepository = organisationRepository;
        this.brandRepository = brandRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;

        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    @Transactional
    public BrandDocumentResponse uploadDocument(
            UUID organisationId,
            UUID brandId,
            MultipartFile file,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new IllegalArgumentException("Organisation not found"));

        Brand brand = null;
        if (brandId != null) {
            brand = brandRepository.findById(brandId)
                    .filter(b -> b.getOrganisation().getId().equals(organisationId))
                    .orElseThrow(() -> new IllegalArgumentException("Brand not found in this organisation"));
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "unknown_file";
        }

        // Validate extension
        String lowerName = originalFilename.toLowerCase(Locale.ROOT);
        String fileType;
        if (lowerName.endsWith(".pdf")) {
            fileType = "PDF";
        } else if (lowerName.endsWith(".docx")) {
            fileType = "DOCX";
        } else if (lowerName.endsWith(".txt")) {
            fileType = "TXT";
        } else {
            throw new IllegalArgumentException("Unsupported file format. Only PDF, DOCX, and TXT are supported.");
        }

        // Validate file size (e.g. max 15MB)
        long maxSize = 15L * 1024L * 1024L;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed limit of 15MB");
        }

        // Generate safe stored filename
        String storedFilename = UUID.randomUUID().toString() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
        Path targetPath = uploadDir.resolve(storedFilename).normalize();

        // Prevent path traversal
        if (!targetPath.startsWith(uploadDir)) {
            throw new SecurityException("Invalid file path / potential path traversal");
        }

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store uploaded file", e);
        }

        // Extract text
        String extractedText = extractTextFromFile(targetPath, fileType, file);

        BrandDocument document = new BrandDocument();
        document.setOrganisation(organisation);
        document.setBrand(brand);
        document.setOriginalFilename(originalFilename);
        document.setStoredFilename(storedFilename);
        document.setFileType(fileType);
        document.setFileSize(file.getSize());
        document.setFilePath(targetPath.toString());
        document.setProcessingStatus(ProcessingStatus.PROCESSED);
        document.setExtractedText(extractedText);
        document.setUploadedBy(actor);

        BrandDocument saved = documentRepository.save(document);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BrandDocumentResponse> getDocuments(
            UUID organisationId,
            UUID brandId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        List<BrandDocument> documents;
        if (brandId != null) {
            documents = documentRepository.findByBrand_Id(brandId);
        } else {
            documents = documentRepository.findByOrganisation_Id(organisationId);
        }

        return documents.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BrandDocument getDocumentEntity(UUID organisationId, UUID documentId, String actorEmail) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        return documentRepository.findById(documentId)
                .filter(d -> d.getOrganisation().getId().equals(organisationId))
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
    }

    @Transactional
    public void deleteDocument(
            UUID organisationId,
            UUID documentId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        Membership membership = findMembership(actor.getId(), organisationId);

        BrandDocument document = documentRepository.findById(documentId)
                .filter(d -> d.getOrganisation().getId().equals(organisationId))
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        Role role = membership.getRole();
        if (role != Role.OWNER && role != Role.ADMIN && !document.getUploadedBy().getId().equals(actor.getId())) {
            throw new AccessDeniedException("Only OWNER, ADMIN, or the document uploader can delete this document");
        }

        // Delete physical file
        try {
            Path path = Paths.get(document.getFilePath());
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
        }

        documentRepository.delete(document);
    }

    private String extractTextFromFile(Path path, String fileType, MultipartFile file) {
        try {
            if ("TXT".equalsIgnoreCase(fileType)) {
                return new String(file.getBytes(), StandardCharsets.UTF_8);
            } else {
                // For PDF/DOCX, provide structured summary / fallback text extraction or bytes length description if parser libraries aren't bundled
                // To be robust without adding heavy unmanaged binaries, we read as text or byte summary
                byte[] bytes = file.getBytes();
                String contentPreview = new String(bytes, StandardCharsets.UTF_8).replaceAll("[^\\x20-\\x7E\\n\\r]", " ");
                if (contentPreview.length() > 5000) {
                    contentPreview = contentPreview.substring(0, 5000);
                }
                return "[Extracted " + fileType + " content preview / raw text]:\n" + contentPreview;
            }
        } catch (Exception e) {
            return "[Text extraction failed: " + e.getMessage() + "]";
        }
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Membership findMembership(UUID userId, UUID organisationId) {
        return membershipRepository.findByUser_IdAndOrganisation_Id(userId, organisationId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this organisation"));
    }

    private BrandDocumentResponse toResponse(BrandDocument doc) {
        UUID brandId = doc.getBrand() != null ? doc.getBrand().getId() : null;
        String brandName = doc.getBrand() != null ? doc.getBrand().getName() : null;
        String uploadedByEmail = doc.getUploadedBy() != null ? doc.getUploadedBy().getEmail() : null;

        return new BrandDocumentResponse(
                doc.getId(),
                doc.getOrganisation().getId(),
                brandId,
                brandName,
                doc.getOriginalFilename(),
                doc.getFileType(),
                doc.getFileSize(),
                doc.getProcessingStatus().name(),
                uploadedByEmail,
                doc.getCreatedAt()
        );
    }
}
