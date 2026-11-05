package com.dropletai.backend.controller;

import com.dropletai.backend.dto.BrandKnowledgeResponse;
import com.dropletai.backend.service.BrandKnowledgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/organisations/{organisationId}/knowledge")
public class BrandKnowledgeController {

    private final BrandKnowledgeService knowledgeService;

    public BrandKnowledgeController(BrandKnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @GetMapping
    public ResponseEntity<BrandKnowledgeResponse> getBrandKnowledge(
            @PathVariable UUID organisationId,
            @RequestParam(required = false) UUID brandId,
            Authentication authentication
    ) {
        String actorEmail = authentication.getName();
        BrandKnowledgeResponse response = knowledgeService.getBrandKnowledge(organisationId, brandId, actorEmail);
        return ResponseEntity.ok(response);
    }
}
