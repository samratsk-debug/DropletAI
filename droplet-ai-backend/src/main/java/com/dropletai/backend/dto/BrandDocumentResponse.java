package com.dropletai.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class BrandDocumentResponse {

    private UUID id;
    private UUID organisationId;
    private UUID brandId;
    private String brandName;
    private String originalFilename;
    private String fileType;
    private Long fileSize;
    private String processingStatus;
    private String uploadedByEmail;
    private LocalDateTime createdAt;

    public BrandDocumentResponse() {
    }

    public BrandDocumentResponse(
            UUID id,
            UUID organisationId,
            UUID brandId,
            String brandName,
            String originalFilename,
            String fileType,
            Long fileSize,
            String processingStatus,
            String uploadedByEmail,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.organisationId = organisationId;
        this.brandId = brandId;
        this.brandName = brandName;
        this.originalFilename = originalFilename;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.processingStatus = processingStatus;
        this.uploadedByEmail = uploadedByEmail;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getOrganisationId() {
        return organisationId;
    }

    public void setOrganisationId(UUID organisationId) {
        this.organisationId = organisationId;
    }

    public UUID getBrandId() {
        return brandId;
    }

    public void setBrandId(UUID brandId) {
        this.brandId = brandId;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getProcessingStatus() {
        return processingStatus;
    }

    public void setProcessingStatus(String processingStatus) {
        this.processingStatus = processingStatus;
    }

    public String getUploadedByEmail() {
        return uploadedByEmail;
    }

    public void setUploadedByEmail(String uploadedByEmail) {
        this.uploadedByEmail = uploadedByEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
