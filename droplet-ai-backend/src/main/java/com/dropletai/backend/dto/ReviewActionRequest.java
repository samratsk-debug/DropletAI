package com.dropletai.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class ReviewActionRequest {

    @NotBlank(message = "Action is required (APPROVE, REJECT, REQUEST_REVISION)")
    private String action; // APPROVE, REJECT, REQUEST_REVISION

    private String comment;
    private UUID reviewerId; // Optional assignment

    public ReviewActionRequest() {
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

    public UUID getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(UUID reviewerId) {
        this.reviewerId = reviewerId;
    }
}
