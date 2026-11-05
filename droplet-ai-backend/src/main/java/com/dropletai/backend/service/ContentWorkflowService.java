package com.dropletai.backend.service;

import com.dropletai.backend.dto.*;
import com.dropletai.backend.entity.*;
import com.dropletai.backend.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ContentWorkflowService {

    private final ContentSubmissionRepository submissionRepository;
    private final AnalysisReportRepository analysisReportRepository;
    private final ReviewLogRepository reviewLogRepository;
    private final OrganisationRepository organisationRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final AiAnalysisService aiAnalysisService;

    public ContentWorkflowService(
            ContentSubmissionRepository submissionRepository,
            AnalysisReportRepository analysisReportRepository,
            ReviewLogRepository reviewLogRepository,
            OrganisationRepository organisationRepository,
            BrandRepository brandRepository,
            UserRepository userRepository,
            MembershipRepository membershipRepository,
            AiAnalysisService aiAnalysisService
    ) {
        this.submissionRepository = submissionRepository;
        this.analysisReportRepository = analysisReportRepository;
        this.reviewLogRepository = reviewLogRepository;
        this.organisationRepository = organisationRepository;
        this.brandRepository = brandRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.aiAnalysisService = aiAnalysisService;
    }

    @Transactional
    public ContentSubmissionResponse createAndSubmitContent(
            UUID organisationId,
            String actorEmail,
            ContentSubmissionRequest request
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new IllegalArgumentException("Organisation not found"));

        Brand brand = brandRepository.findById(request.getBrandId())
                .filter(b -> b.getOrganisation().getId().equals(organisationId))
                .orElseThrow(() -> new IllegalArgumentException("Brand not found in this organisation"));

        User reviewer = null;
        if (request.getReviewerId() != null) {
            reviewer = userRepository.findById(request.getReviewerId())
                    .orElseThrow(() -> new IllegalArgumentException("Reviewer user not found"));
        }

        ContentSubmission submission = new ContentSubmission();
        submission.setOrganisation(organisation);
        submission.setBrand(brand);
        submission.setTitle(request.getTitle().trim());
        submission.setContentType(request.getContentType().trim());
        submission.setContent(request.getContent().trim());
        submission.setStatus(ContentStatus.SUBMITTED);
        submission.setSubmittedBy(actor);
        submission.setReviewer(reviewer);

        ContentSubmission saved = submissionRepository.save(submission);

        // Log review action
        logAction(saved, actor, "SUBMITTED", "Content submitted for AI analysis and review.");

        // Run AI Analysis
        saved.setStatus(ContentStatus.ANALYZING);
        submissionRepository.save(saved);

        AnalysisReport report = aiAnalysisService.analyzeSubmission(saved);

        saved.setStatus(ContentStatus.PENDING_REVIEW);
        ContentSubmission finalSaved = submissionRepository.save(saved);

        return toResponse(finalSaved, report);
    }

    @Transactional(readOnly = true)
    public List<ContentSubmissionResponse> getSubmissions(
            UUID organisationId,
            UUID brandId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        List<ContentSubmission> submissions;
        if (brandId != null) {
            submissions = submissionRepository.findByBrand_Id(brandId);
        } else {
            submissions = submissionRepository.findByOrganisation_Id(organisationId);
        }

        return submissions.stream().map(s -> {
            AnalysisReport report = analysisReportRepository.findBySubmission_Id(s.getId()).orElse(null);
            return toResponse(s, report);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ContentSubmissionResponse getSubmissionDetail(
            UUID organisationId,
            UUID submissionId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        ContentSubmission s = submissionRepository.findById(submissionId)
                .filter(sub -> sub.getOrganisation().getId().equals(organisationId))
                .orElseThrow(() -> new IllegalArgumentException("Content submission not found"));

        AnalysisReport report = analysisReportRepository.findBySubmission_Id(s.getId()).orElse(null);
        return toResponse(s, report);
    }

    @Transactional
    public ContentSubmissionResponse reviewSubmission(
            UUID organisationId,
            UUID submissionId,
            String actorEmail,
            ReviewActionRequest request
    ) {
        User actor = findUser(actorEmail);
        Membership membership = findMembership(actor.getId(), organisationId);

        Role role = membership.getRole();
        if (role != Role.OWNER && role != Role.ADMIN && role != Role.REVIEWER && role != Role.MARKETING_MANAGER) {
            throw new AccessDeniedException("Only OWNER, ADMIN, MARKETING_MANAGER, or REVIEWER can review content submissions");
        }

        ContentSubmission s = submissionRepository.findById(submissionId)
                .filter(sub -> sub.getOrganisation().getId().equals(organisationId))
                .orElseThrow(() -> new IllegalArgumentException("Content submission not found"));

        String actionUpper = request.getAction().toUpperCase(Locale.ROOT);
        ContentStatus newStatus;
        String logActionType;

        switch (actionUpper) {
            case "APPROVE":
                newStatus = ContentStatus.APPROVED;
                logActionType = "APPROVED";
                break;
            case "REJECT":
                newStatus = ContentStatus.REJECTED;
                logActionType = "REJECTED";
                break;
            case "REQUEST_REVISION":
                newStatus = ContentStatus.REVISION_REQUESTED;
                logActionType = "REQUEST_REVISION";
                break;
            default:
                throw new IllegalArgumentException("Invalid review action. Allowed: APPROVE, REJECT, REQUEST_REVISION");
        }

        s.setStatus(newStatus);
        if (request.getReviewerId() != null) {
            User rev = userRepository.findById(request.getReviewerId())
                    .orElseThrow(() -> new IllegalArgumentException("Reviewer not found"));
            s.setReviewer(rev);
        } else if (s.getReviewer() == null) {
            s.setReviewer(actor);
        }

        ContentSubmission saved = submissionRepository.save(s);
        logAction(saved, actor, logActionType, request.getComment());

        AnalysisReport report = analysisReportRepository.findBySubmission_Id(saved.getId()).orElse(null);
        return toResponse(saved, report);
    }

    @Transactional(readOnly = true)
    public List<ReviewLogResponse> getReviewLogs(
            UUID organisationId,
            UUID submissionId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        submissionRepository.findById(submissionId)
                .filter(sub -> sub.getOrganisation().getId().equals(organisationId))
                .orElseThrow(() -> new IllegalArgumentException("Content submission not found"));

        return reviewLogRepository.findBySubmission_Id(submissionId).stream()
                .map(log -> new ReviewLogResponse(
                        log.getId(),
                        log.getSubmission().getId(),
                        log.getActor().getEmail(),
                        log.getAction(),
                        log.getComment(),
                        log.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    private void logAction(ContentSubmission submission, User actor, String action, String comment) {
        ReviewLog log = new ReviewLog();
        log.setSubmission(submission);
        log.setActor(actor);
        log.setAction(action);
        log.setComment(comment);
        reviewLogRepository.save(log);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Membership findMembership(UUID userId, UUID organisationId) {
        return membershipRepository.findByUser_IdAndOrganisation_Id(userId, organisationId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this organisation"));
    }

    private ContentSubmissionResponse toResponse(ContentSubmission s, AnalysisReport report) {
        UUID brandId = s.getBrand() != null ? s.getBrand().getId() : null;
        String brandName = s.getBrand() != null ? s.getBrand().getName() : null;
        String submittedByEmail = s.getSubmittedBy() != null ? s.getSubmittedBy().getEmail() : null;
        String reviewerEmail = s.getReviewer() != null ? s.getReviewer().getEmail() : null;

        AnalysisReportResponse reportResponse = null;
        if (report != null) {
            reportResponse = new AnalysisReportResponse(
                    report.getId(),
                    report.getSubmission().getId(),
                    report.getRiskScore(),
                    report.getRiskCategory(),
                    report.getSummary(),
                    report.getIssuesJson(),
                    report.getAiRecommendations(),
                    report.getCreatedAt()
            );
        }

        return new ContentSubmissionResponse(
                s.getId(),
                s.getOrganisation().getId(),
                brandId,
                brandName,
                s.getTitle(),
                s.getContentType(),
                s.getContent(),
                s.getStatus(),
                submittedByEmail,
                reviewerEmail,
                reportResponse,
                s.getCreatedAt(),
                s.getUpdatedAt()
        );
    }
}
