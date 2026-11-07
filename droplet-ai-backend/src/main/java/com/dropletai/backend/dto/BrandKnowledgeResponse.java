package com.dropletai.backend.dto;

import java.util.List;
import java.util.UUID;

public class BrandKnowledgeResponse {

    private UUID organisationId;
    private UUID brandId;
    private String brandName;
    private List<GuidelineResponse> guidelines;
    private List<ApprovedFactResponse> approvedFacts;
    private List<BrandDocumentResponse> documents;
    private List<String> documentSnippets;

    public BrandKnowledgeResponse() {
    }

    public BrandKnowledgeResponse(
            UUID organisationId,
            UUID brandId,
            String brandName,
            List<GuidelineResponse> guidelines,
            List<ApprovedFactResponse> approvedFacts,
            List<BrandDocumentResponse> documents,
            List<String> documentSnippets
    ) {
        this.organisationId = organisationId;
        this.brandId = brandId;
        this.brandName = brandName;
        this.guidelines = guidelines;
        this.approvedFacts = approvedFacts;
        this.documents = documents;
        this.documentSnippets = documentSnippets;
    }

    public UUID getOrganisationId() {
        return organisationId;
    }

    public void setOrganisationId(UUID organisationId) {
        this.organisationId = organisationId;
    }

    public UUID getBrandId() {
        return brandId;
    }

    public void setBrandId(UUID brandId) {
        this.brandId = brandId;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public List<GuidelineResponse> getGuidelines() {
        return guidelines;
    }

    public void setGuidelines(List<GuidelineResponse> guidelines) {
        this.guidelines = guidelines;
    }

    public List<ApprovedFactResponse> getApprovedFacts() {
        return approvedFacts;
    }

    public void setApprovedFacts(List<ApprovedFactResponse> approvedFacts) {
        this.approvedFacts = approvedFacts;
    }

    public List<BrandDocumentResponse> getDocuments() {
        return documents;
    }

    public void setDocuments(List<BrandDocumentResponse> documents) {
        this.documents = documents;
    }

    public List<String> getDocumentSnippets() {
        return documentSnippets;
    }

    public void setDocumentSnippets(List<String> documentSnippets) {
        this.documentSnippets = documentSnippets;
    }
}
