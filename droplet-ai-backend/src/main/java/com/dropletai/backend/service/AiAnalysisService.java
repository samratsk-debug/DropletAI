package com.dropletai.backend.service;

import com.dropletai.backend.entity.AnalysisReport;
import com.dropletai.backend.entity.ApprovedFact;
import com.dropletai.backend.entity.ContentSubmission;
import com.dropletai.backend.entity.Guideline;
import com.dropletai.backend.repository.AnalysisReportRepository;
import com.dropletai.backend.repository.ApprovedFactRepository;
import com.dropletai.backend.repository.GuidelineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class AiAnalysisService {

    private final AnalysisReportRepository analysisReportRepository;
    private final GuidelineRepository guidelineRepository;
    private final ApprovedFactRepository approvedFactRepository;

    public AiAnalysisService(
            AnalysisReportRepository analysisReportRepository,
            GuidelineRepository guidelineRepository,
            ApprovedFactRepository approvedFactRepository
    ) {
        this.analysisReportRepository = analysisReportRepository;
        this.guidelineRepository = guidelineRepository;
        this.approvedFactRepository = approvedFactRepository;
    }

    @Transactional
    public AnalysisReport analyzeSubmission(ContentSubmission submission) {
        UUID orgId = submission.getOrganisation().getId();
        UUID brandId = submission.getBrand() != null ? submission.getBrand().getId() : null;

        // Fetch brand knowledge
        List<Guideline> guidelines = guidelineRepository.findByOrganisation_Id(orgId);
        if (brandId != null) {
            guidelines = guidelines.stream()
                    .filter(g -> g.getBrand() == null || g.getBrand().getId().equals(brandId))
                    .toList();
        }

        List<ApprovedFact> facts = approvedFactRepository.findByOrganisation_Id(orgId);

        String contentText = submission.getContent().toLowerCase(Locale.ROOT);

        int riskScore = 10;
        List<String> issues = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        // 1. Check guidelines / prohibited words or tone rules
        for (Guideline g : guidelines) {
            String title = g.getTitle();
            String gContent = g.getContent().toLowerCase(Locale.ROOT);
            // Simple heuristic check: if guideline content contains specific restrictions
            if (gContent.contains("prohibited") || gContent.contains("never") || gContent.contains("avoid")) {
                // Check if any keyword matches
                if (contentText.contains("guarantee") && gContent.contains("guarantee")) {
                    riskScore += 35;
                    issues.add("Violation of guideline [" + title + "]: Content uses 'guarantee' which is restricted.");
                    recommendations.add("Remove absolute guarantees and use qualifying language.");
                }
            }
        }

        // 2. Check claim verification against approved facts
        boolean foundFactConflict = false;
        for (ApprovedFact f : facts) {
            String fTitle = f.getTitle();
            String fContent = f.getContent();
            // If submission makes conflicting statements (e.g. price, specs)
            if (contentText.contains("free") && fContent.toLowerCase(Locale.ROOT).contains("paid")) {
                riskScore += 25;
                issues.add("Potential contradiction with approved fact [" + fTitle + "].");
                recommendations.add("Align marketing claim with approved fact: " + fContent);
                foundFactConflict = true;
            }
        }

        if (!foundFactConflict && riskScore < 20) {
            recommendations.add("Content is consistent with brand guidelines and approved facts.");
        }

        if (riskScore > 100) riskScore = 100;

        String riskCategory;
        if (riskScore >= 75) {
            riskCategory = "CRITICAL";
        } else if (riskScore >= 50) {
            riskCategory = "HIGH";
        } else if (riskScore >= 25) {
            riskCategory = "MEDIUM";
        } else {
            riskCategory = "LOW";
        }

        String summary = "AI analysis completed with risk score " + riskScore + "/100 (" + riskCategory + "). Detected " + issues.size() + " potential issue(s).";
        String issuesJson = String.join("\n- ", issues);
        if (!issues.isEmpty()) {
            issuesJson = "- " + issuesJson;
        } else {
            issuesJson = "No major guideline or fact violations detected.";
        }
        String aiRecs = String.join("\n- ", recommendations);
        if (!recommendations.isEmpty()) {
            aiRecs = "- " + aiRecs;
        }

        // Check if report already exists
        AnalysisReport report = analysisReportRepository.findBySubmission_Id(submission.getId())
                .orElse(new AnalysisReport());

        report.setSubmission(submission);
        report.setRiskScore(riskScore);
        report.setRiskCategory(riskCategory);
        report.setSummary(summary);
        report.setIssuesJson(issuesJson);
        report.setAiRecommendations(aiRecs);

        return analysisReportRepository.save(report);
    }
}
