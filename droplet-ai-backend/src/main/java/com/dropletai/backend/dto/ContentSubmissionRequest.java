package com.dropletai.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class ContentSubmissionRequest {

    @NotNull(message = "Brand ID is required")
    private UUID brandId;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Content type is required")
    private String contentType; // e.g. SOCIAL_MEDIA, AD, MARKETING_COPY, PRODUCT_DESCRIPTION, WEBSITE

    @NotBlank(message = "Content is required")
    private String content;

    private UUID reviewerId; // Optional reviewer assignment

    public ContentSubmissionRequest() {
    }

    public UUID getBrandId() {
        return brandId;
    }

    public void setBrandId(UUID brandId) {
        this.brandId = brandId;
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

    public UUID getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(UUID reviewerId) {
        this.reviewerId = reviewerId;
    }
}
