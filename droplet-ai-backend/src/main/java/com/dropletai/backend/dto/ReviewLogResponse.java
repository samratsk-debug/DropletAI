package com.dropletai.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReviewLogResponse {

    private UUID id;
    private UUID submissionId;
    private String actorEmail;
    private String action;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewLogResponse() {
    }

    public ReviewLogResponse(
            UUID id,
            UUID submissionId,
            String actorEmail,
            String action,
            String comment,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.submissionId = submissionId;
        this.actorEmail = actorEmail;
        this.action = action;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(UUID submissionId) {
        this.submissionId = submissionId;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public void setActorEmail(String actorEmail) {
        this.actorEmail = actorEmail;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
