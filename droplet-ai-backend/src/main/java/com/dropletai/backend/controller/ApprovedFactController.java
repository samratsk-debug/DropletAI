package com.dropletai.backend.controller;

import com.dropletai.backend.dto.ApprovedFactRequest;
import com.dropletai.backend.dto.ApprovedFactResponse;
import com.dropletai.backend.entity.VerificationStatus;
import com.dropletai.backend.service.ApprovedFactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organisations/{organisationId}/facts")
public class ApprovedFactController {

    private final ApprovedFactService approvedFactService;

    public ApprovedFactController(ApprovedFactService approvedFactService) {
        this.approvedFactService = approvedFactService;
    }

    @PostMapping
    public ResponseEntity<ApprovedFactResponse> createFact(
            @PathVariable UUID organisationId,
            @Valid @RequestBody ApprovedFactRequest request,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        ApprovedFactResponse response = approvedFactService.createFact(organisationId, actorEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ApprovedFactResponse>> getFacts(
            @PathVariable UUID organisationId,
            @RequestParam(required = false) UUID brandId,
            @RequestParam(required = false) VerificationStatus status,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        List<ApprovedFactResponse> responses = approvedFactService.getFacts(organisationId, brandId, status, actorEmail);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{factId}/status")
    public ResponseEntity<ApprovedFactResponse> updateStatus(
            @PathVariable UUID organisationId,
            @PathVariable UUID factId,
            @RequestParam VerificationStatus status,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        ApprovedFactResponse response = approvedFactService.updateVerificationStatus(organisationId, factId, status, actorEmail);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{factId}")
    public ResponseEntity<Void> deleteFact(
            @PathVariable UUID organisationId,
            @PathVariable UUID factId,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        approvedFactService.deleteFact(organisationId, factId, actorEmail);
        return ResponseEntity.noContent().build();
    }
}
