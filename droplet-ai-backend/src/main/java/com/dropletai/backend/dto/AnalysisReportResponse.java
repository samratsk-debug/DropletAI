package com.dropletai.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class AnalysisReportResponse {

    private UUID id;
    private UUID submissionId;
    private Integer riskScore;
    private String riskCategory;
    private String summary;
    private String issuesJson;
    private String aiRecommendations;
    private LocalDateTime createdAt;

    public AnalysisReportResponse() {
    }

    public AnalysisReportResponse(
            UUID id,
            UUID submissionId,
            Integer riskScore,
            String riskCategory,
            String summary,
            String issuesJson,
            String aiRecommendations,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.submissionId = submissionId;
        this.riskScore = riskScore;
        this.riskCategory = riskCategory;
        this.summary = summary;
        this.issuesJson = issuesJson;
        this.aiRecommendations = aiRecommendations;
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

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(String riskCategory) {
        this.riskCategory = riskCategory;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getIssuesJson() {
        return issuesJson;
    }

    public void setIssuesJson(String issuesJson) {
        this.issuesJson = issuesJson;
    }

    public String getAiRecommendations() {
        return aiRecommendations;
    }

    public void setAiRecommendations(String aiRecommendations) {
        this.aiRecommendations = aiRecommendations;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
