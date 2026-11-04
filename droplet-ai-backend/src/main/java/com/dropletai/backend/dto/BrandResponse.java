
package com.dropletai.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class BrandResponse {

    private UUID id;
    private String name;
    private String description;
    private UUID organisationId;
    private LocalDateTime createdAt;

    public BrandResponse(
            UUID id,
            String name,
            String description,
            UUID organisationId,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.organisationId = organisationId;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public UUID getOrganisationId() {
        return organisationId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
