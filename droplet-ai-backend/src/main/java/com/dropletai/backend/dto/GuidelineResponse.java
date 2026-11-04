
package com.dropletai.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class GuidelineResponse {

    private UUID id;
    private String title;
    private String content;
    private UUID organisationId;
    private UUID brandId;
    private LocalDateTime createdAt;

    public GuidelineResponse(
            UUID id,
            String title,
            String content,
            UUID organisationId,
            UUID brandId,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.organisationId = organisationId;
        this.brandId = brandId;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public UUID getOrganisationId() {
        return organisationId;
    }

    public UUID getBrandId() {
        return brandId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
