package com.dropletai.backend.dto;

import java.util.UUID;

public class AuthResponse {

    private String token;
    private String tokenType;
    private UUID userId;
    private String fullName;
    private String email;
    private UUID organisationId;
    private String organisationName;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(
            String token,
            UUID userId,
            String fullName,
            String email,
            UUID organisationId,
            String organisationName,
            String role
    ) {
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.organisationId = organisationId;
        this.organisationName = organisationName;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public UUID getOrganisationId() {
        return organisationId;
    }

    public String getOrganisationName() {
        return organisationName;
    }

    public String getRole() {
        return role;
    }
}