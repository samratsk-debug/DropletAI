
package com.dropletai.backend.controller;

import com.dropletai.backend.dto.GuidelineRequest;
import com.dropletai.backend.dto.GuidelineResponse;
import com.dropletai.backend.service.GuidelineService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/organisations/{organisationId}/guidelines")
public class GuidelineController {

    private final GuidelineService guidelineService;

    public GuidelineController(GuidelineService guidelineService) {
        this.guidelineService = guidelineService;
    }

    // CREATE GUIDELINE
    @PostMapping
    public ResponseEntity<GuidelineResponse> createGuideline(
            @PathVariable UUID organisationId,
            @Valid @RequestBody GuidelineRequest request,
            Authentication authentication
    ) {
        GuidelineResponse response =
                guidelineService.createGuideline(
                        organisationId,
                        authentication.getName(),
                        request
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL GUIDELINES
    @GetMapping
    public ResponseEntity<List<GuidelineResponse>> getGuidelines(
            @PathVariable UUID organisationId,
            Authentication authentication
    ) {
        List<GuidelineResponse> guidelines =
                guidelineService.getGuidelines(
                        organisationId,
                        authentication.getName()
                );

        return ResponseEntity.ok(guidelines);
    }

    // UPDATE GUIDELINE
    @PutMapping("/{guidelineId}")
    public ResponseEntity<GuidelineResponse> updateGuideline(
            @PathVariable UUID organisationId,
            @PathVariable UUID guidelineId,
            @Valid @RequestBody GuidelineRequest request,
            Authentication authentication
    ) {
        GuidelineResponse response =
                guidelineService.updateGuideline(
                        organisationId,
                        guidelineId,
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    // DELETE GUIDELINE
    @DeleteMapping("/{guidelineId}")
    public ResponseEntity<Map<String, String>> deleteGuideline(
            @PathVariable UUID organisationId,
            @PathVariable UUID guidelineId,
            Authentication authentication
    ) {
        guidelineService.deleteGuideline(
                organisationId,
                guidelineId,
                authentication.getName()
        );

        return ResponseEntity.ok(
                Map.of("message", "Guideline deleted successfully")
        );
    }
}
