package com.dropletai.backend.service;

import com.dropletai.backend.dto.*;
import com.dropletai.backend.entity.*;
import com.dropletai.backend.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BrandKnowledgeService {

    private final OrganisationRepository organisationRepository;
    private final BrandRepository brandRepository;
    private final GuidelineRepository guidelineRepository;
    private final ApprovedFactRepository approvedFactRepository;
    private final BrandDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    public BrandKnowledgeService(
            OrganisationRepository organisationRepository,
            BrandRepository brandRepository,
            GuidelineRepository guidelineRepository,
            ApprovedFactRepository approvedFactRepository,
            BrandDocumentRepository documentRepository,
            UserRepository userRepository,
            MembershipRepository membershipRepository
    ) {
        this.organisationRepository = organisationRepository;
        this.brandRepository = brandRepository;
        this.guidelineRepository = guidelineRepository;
        this.approvedFactRepository = approvedFactRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional(readOnly = true)
    public BrandKnowledgeResponse getBrandKnowledge(
            UUID organisationId,
            UUID brandId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new IllegalArgumentException("Organisation not found"));

        Brand brand = null;
        String brandName = null;
        if (brandId != null) {
            brand = brandRepository.findById(brandId)
                    .filter(b -> b.getOrganisation().getId().equals(organisationId))
                    .orElseThrow(() -> new IllegalArgumentException("Brand not found in this organisation"));
            brandName = brand.getName();
        }

        // 1. Guidelines (Org-wide + Brand specific if brandId provided)
        List<Guideline> guidelineList = guidelineRepository.findByOrganisation_Id(organisationId);
        if (brandId != null) {
            UUID finalBrandId = brandId;
            guidelineList = guidelineList.stream()
                    .filter(g -> g.getBrand() == null || g.getBrand().getId().equals(finalBrandId))
                    .collect(Collectors.toList());
        }

        List<GuidelineResponse> guidelineResponses = guidelineList.stream()
                .map(g -> new GuidelineResponse(
                        g.getId(),
                        g.getTitle(),
                        g.getContent(),
                        g.getOrganisation().getId(),
                        g.getBrand() != null ? g.getBrand().getId() : null,
                        g.getCreatedAt()
                ))
                .collect(Collectors.toList());

        // 2. Approved Facts (Only APPROVED status, org-wide or brand specific)
        List<ApprovedFact> allFacts = approvedFactRepository.findByOrganisation_IdAndVerificationStatus(
                organisationId,
                VerificationStatus.APPROVED
        );

        if (brandId != null) {
            UUID finalBrandId = brandId;
            allFacts = allFacts.stream()
                    .filter(f -> f.getBrand() == null || f.getBrand().getId().equals(finalBrandId))
                    .collect(Collectors.toList());
        }

        List<ApprovedFactResponse> factResponses = allFacts.stream()
                .map(f -> {
                    String approvedByEmail = f.getApprovedBy() != null ? f.getApprovedBy().getEmail() : null;
                    UUID bId = f.getBrand() != null ? f.getBrand().getId() : null;
                    String bName = f.getBrand() != null ? f.getBrand().getName() : null;
                    return new ApprovedFactResponse(
                            f.getId(),
                            f.getOrganisation().getId(),
                            bId,
                            bName,
                            f.getTitle(),
                            f.getContent(),
                            f.getSource(),
                            f.getVerificationStatus(),
                            approvedByEmail,
                            f.getApprovedAt(),
                            f.getCreatedAt(),
                            f.getUpdatedAt()
                    );
                })
                .collect(Collectors.toList());

        // 3. Documents & Snippets
        List<BrandDocument> documents = documentRepository.findByOrganisation_Id(organisationId);
        if (brandId != null) {
            UUID finalBrandId1 = brandId;
            documents = documents.stream()
                    .filter(d -> d.getBrand() == null || d.getBrand().getId().equals(finalBrandId1))
                    .collect(Collectors.toList());
        }

        List<BrandDocumentResponse> docResponses = documents.stream()
                .map(d -> {
                    UUID bId = d.getBrand() != null ? d.getBrand().getId() : null;
                    String bName = d.getBrand() != null ? d.getBrand().getName() : null;
                    String uEmail = d.getUploadedBy() != null ? d.getUploadedBy().getEmail() : null;
                    return new BrandDocumentResponse(
                            d.getId(),
                            d.getOrganisation().getId(),
                            bId,
                            bName,
                            d.getOriginalFilename(),
                            d.getFileType(),
                            d.getFileSize(),
                            d.getProcessingStatus().name(),
                            uEmail,
                            d.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());

        List<String> snippets = new ArrayList<>();
        for (BrandDocument doc : documents) {
            if (doc.getExtractedText() != null && !doc.getExtractedText().isEmpty()) {
                snippets.add("Doc [" + doc.getOriginalFilename() + "]: " + doc.getExtractedText());
            }
        }

        return new BrandKnowledgeResponse(
                organisationId,
                brandId,
                brandName,
                guidelineResponses,
                factResponses,
                docResponses,
                snippets
        );
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Membership findMembership(UUID userId, UUID organisationId) {
        return membershipRepository.findByUser_IdAndOrganisation_Id(userId, organisationId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this organisation"));
    }
}
