package com.dropletai.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FirebaseTokenRequest {

    @NotBlank(message = "Firebase ID token is required")
    private String idToken;

    @Size(max = 100, message = "Full name must contain at most 100 characters")
    private String fullName;

    @Size(max = 150, message = "Organisation name must contain at most 150 characters")
    private String organisationName;

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getOrganisationName() {
        return organisationName;
    }

    public void setOrganisationName(String organisationName) {
        this.organisationName = organisationName;
    }
}
