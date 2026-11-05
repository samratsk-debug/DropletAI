package com.dropletai.backend.controller;

import com.dropletai.backend.dto.BrandDocumentResponse;
import com.dropletai.backend.entity.BrandDocument;
import com.dropletai.backend.service.BrandDocumentService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organisations/{organisationId}/documents")
public class BrandDocumentController {

    private final BrandDocumentService documentService;

    public BrandDocumentController(BrandDocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BrandDocumentResponse> uploadDocument(
            @PathVariable UUID organisationId,
            @RequestParam(required = false) UUID brandId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        BrandDocumentResponse response = documentService.uploadDocument(organisationId, brandId, file, actorEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<BrandDocumentResponse>> getDocuments(
            @PathVariable UUID organisationId,
            @RequestParam(required = false) UUID brandId,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        List<BrandDocumentResponse> responses = documentService.getDocuments(organisationId, brandId, actorEmail);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable UUID organisationId,
            @PathVariable UUID documentId,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        BrandDocument doc = documentService.getDocumentEntity(organisationId, documentId, actorEmail);

        try {
            Path path = Paths.get(doc.getFilePath());
            byte[] data = Files.readAllBytes(path);
            ByteArrayResource resource = new ByteArrayResource(data);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getOriginalFilename() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(data.length)
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable UUID organisationId,
            @PathVariable UUID documentId,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        documentService.deleteDocument(organisationId, documentId, actorEmail);
        return ResponseEntity.noContent().build();
    }
}
