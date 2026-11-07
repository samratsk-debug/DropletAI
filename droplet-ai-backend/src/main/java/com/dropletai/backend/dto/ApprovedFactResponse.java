package com.dropletai.backend.dto;

import com.dropletai.backend.entity.VerificationStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class ApprovedFactResponse {

    private UUID id;
    private UUID organisationId;
    private UUID brandId;
    private String brandName;
    private String title;
    private String content;
    private String source;
    private VerificationStatus verificationStatus;
    private String approvedByEmail;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ApprovedFactResponse() {
    }

    public ApprovedFactResponse(
            UUID id,
            UUID organisationId,
            UUID brandId,
            String brandName,
            String title,
            String content,
            String source,
            VerificationStatus verificationStatus,
            String approvedByEmail,
            LocalDateTime approvedAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.organisationId = organisationId;
        this.brandId = brandId;
        this.brandName = brandName;
        this.title = title;
        this.content = content;
        this.source = source;
        this.verificationStatus = verificationStatus;
        this.approvedByEmail = approvedByEmail;
        this.approvedAt = approvedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getApprovedByEmail() {
        return approvedByEmail;
    }

    public void setApprovedByEmail(String approvedByEmail) {
        this.approvedByEmail = approvedByEmail;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
