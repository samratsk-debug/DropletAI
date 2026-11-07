package com.dropletai.backend.controller;

import com.dropletai.backend.dto.*;
import com.dropletai.backend.service.ContentWorkflowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organisations/{organisationId}/content")
public class ContentReviewController {

    private final ContentWorkflowService workflowService;

    public ContentReviewController(ContentWorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @PostMapping
    public ResponseEntity<ContentSubmissionResponse> submitContent(
            @PathVariable UUID organisationId,
            @Valid @RequestBody ContentSubmissionRequest request,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        ContentSubmissionResponse response = workflowService.createAndSubmitContent(organisationId, actorEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ContentSubmissionResponse>> getSubmissions(
            @PathVariable UUID organisationId,
            @RequestParam(required = false) UUID brandId,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        List<ContentSubmissionResponse> responses = workflowService.getSubmissions(organisationId, brandId, actorEmail);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<ContentSubmissionResponse> getSubmissionDetail(
            @PathVariable UUID organisationId,
            @PathVariable UUID submissionId,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        ContentSubmissionResponse response = workflowService.getSubmissionDetail(organisationId, submissionId, actorEmail);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{submissionId}/review")
    public ResponseEntity<ContentSubmissionResponse> reviewSubmission(
            @PathVariable UUID organisationId,
            @PathVariable UUID submissionId,
            @Valid @RequestBody ReviewActionRequest request,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        ContentSubmissionResponse response = workflowService.reviewSubmission(organisationId, submissionId, actorEmail, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{submissionId}/logs")
    public ResponseEntity<List<ReviewLogResponse>> getReviewLogs(
            @PathVariable UUID organisationId,
            @PathVariable UUID submissionId,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        List<ReviewLogResponse> logs = workflowService.getReviewLogs(organisationId, submissionId, actorEmail);
        return ResponseEntity.ok(logs);
    }
}
