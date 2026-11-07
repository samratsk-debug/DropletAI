package com.dropletai.backend.dto;

import com.dropletai.backend.entity.ContentStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class ContentSubmissionResponse {

    private UUID id;
    private UUID organisationId;
    private UUID brandId;
    private String brandName;
    private String title;
    private String contentType;
    private String content;
    private ContentStatus status;
    private String submittedByEmail;
    private String reviewerEmail;
    private AnalysisReportResponse analysisReport;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ContentSubmissionResponse() {
    }

    public ContentSubmissionResponse(
            UUID id,
            UUID organisationId,
            UUID brandId,
            String brandName,
            String title,
            String contentType,
            String content,
            ContentStatus status,
            String submittedByEmail,
            String reviewerEmail,
            AnalysisReportResponse analysisReport,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.organisationId = organisationId;
        this.brandId = brandId;
        this.brandName = brandName;
        this.title = title;
        this.contentType = contentType;
        this.content = content;
        this.status = status;
        this.submittedByEmail = submittedByEmail;
        this.reviewerEmail = reviewerEmail;
        this.analysisReport = analysisReport;
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

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ContentStatus getStatus() {
        return status;
    }

    public void setStatus(ContentStatus status) {
        this.status = status;
    }

    public String getSubmittedByEmail() {
        return submittedByEmail;
    }

    public void setSubmittedByEmail(String submittedByEmail) {
        this.submittedByEmail = submittedByEmail;
    }

    public String getReviewerEmail() {
        return reviewerEmail;
    }

    public void setReviewerEmail(String reviewerEmail) {
        this.reviewerEmail = reviewerEmail;
    }

    public AnalysisReportResponse getAnalysisReport() {
        return analysisReport;
    }

    public void setAnalysisReport(AnalysisReportResponse analysisReport) {
        this.analysisReport = analysisReport;
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
