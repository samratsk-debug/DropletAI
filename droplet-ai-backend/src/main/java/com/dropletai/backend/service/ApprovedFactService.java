package com.dropletai.backend.service;

import com.dropletai.backend.dto.ApprovedFactRequest;
import com.dropletai.backend.dto.ApprovedFactResponse;
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
public class ApprovedFactService {

    private final ApprovedFactRepository approvedFactRepository;
    private final OrganisationRepository organisationRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    public ApprovedFactService(
            ApprovedFactRepository approvedFactRepository,
            OrganisationRepository organisationRepository,
            BrandRepository brandRepository,
            UserRepository userRepository,
            MembershipRepository membershipRepository
    ) {
        this.approvedFactRepository = approvedFactRepository;
        this.organisationRepository = organisationRepository;
        this.brandRepository = brandRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional
    public ApprovedFactResponse createFact(
            UUID organisationId,
            String actorEmail,
            ApprovedFactRequest request
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        Organisation organisation = organisationRepository.findById(organisationId)
                .orElseThrow(() -> new IllegalArgumentException("Organisation not found"));

        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId())
                    .filter(b -> b.getOrganisation().getId().equals(organisationId))
                    .orElseThrow(() -> new IllegalArgumentException("Brand not found in this organisation"));
        }

        ApprovedFact fact = new ApprovedFact();
        fact.setOrganisation(organisation);
        fact.setBrand(brand);
        fact.setTitle(request.getTitle().trim());
        fact.setContent(request.getContent().trim());
        fact.setSource(request.getSource() != null ? request.getSource().trim() : null);
        fact.setVerificationStatus(VerificationStatus.PENDING);

        ApprovedFact saved = approvedFactRepository.save(fact);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ApprovedFactResponse> getFacts(
            UUID organisationId,
            UUID brandId,
            VerificationStatus status,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        findMembership(actor.getId(), organisationId);

        List<ApprovedFact> facts;
        if (brandId != null) {
            if (status != null) {
                facts = approvedFactRepository.findByBrand_IdAndVerificationStatus(brandId, status);
            } else {
                facts = approvedFactRepository.findByBrand_Id(brandId);
            }
        } else {
            if (status != null) {
                facts = approvedFactRepository.findByOrganisation_IdAndVerificationStatus(organisationId, status);
            } else {
                facts = approvedFactRepository.findByOrganisation_Id(organisationId);
            }
        }

        return facts.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ApprovedFactResponse updateVerificationStatus(
            UUID organisationId,
            UUID factId,
            VerificationStatus newStatus,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        Membership membership = findMembership(actor.getId(), organisationId);

        // Only OWNER, ADMIN, or REVIEWER can approve/reject facts
        Role role = membership.getRole();
        if (role != Role.OWNER && role != Role.ADMIN && role != Role.REVIEWER && role != Role.MARKETING_MANAGER) {
            throw new AccessDeniedException("Only OWNER, ADMIN, MARKETING_MANAGER, or REVIEWER can approve or reject facts");
        }

        ApprovedFact fact = approvedFactRepository.findById(factId)
                .filter(f -> f.getOrganisation().getId().equals(organisationId))
                .orElseThrow(() -> new IllegalArgumentException("Approved fact not found"));

        fact.setVerificationStatus(newStatus);
        if (newStatus == VerificationStatus.APPROVED) {
            fact.setApprovedBy(actor);
            fact.setApprovedAt(LocalDateTime.now());
        } else if (newStatus == VerificationStatus.REJECTED) {
            fact.setApprovedBy(actor);
            fact.setApprovedAt(LocalDateTime.now());
        }

        ApprovedFact saved = approvedFactRepository.save(fact);
        return toResponse(saved);
    }

    @Transactional
    public void deleteFact(
            UUID organisationId,
            UUID factId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);
        Membership membership = findMembership(actor.getId(), organisationId);

        ApprovedFact fact = approvedFactRepository.findById(factId)
                .filter(f -> f.getOrganisation().getId().equals(organisationId))
                .orElseThrow(() -> new IllegalArgumentException("Approved fact not found"));

        Role role = membership.getRole();
        if (role != Role.OWNER && role != Role.ADMIN) {
            throw new AccessDeniedException("Only OWNER or ADMIN can delete facts");
        }

        approvedFactRepository.delete(fact);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Membership findMembership(UUID userId, UUID organisationId) {
        return membershipRepository.findByUser_IdAndOrganisation_Id(userId, organisationId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this organisation"));
    }

    private ApprovedFactResponse toResponse(ApprovedFact fact) {
        String approvedByEmail = fact.getApprovedBy() != null ? fact.getApprovedBy().getEmail() : null;
        UUID brandId = fact.getBrand() != null ? fact.getBrand().getId() : null;
        String brandName = fact.getBrand() != null ? fact.getBrand().getName() : null;

        return new ApprovedFactResponse(
                fact.getId(),
                fact.getOrganisation().getId(),
                brandId,
                brandName,
                fact.getTitle(),
                fact.getContent(),
                fact.getSource(),
                fact.getVerificationStatus(),
                approvedByEmail,
                fact.getApprovedAt(),
                fact.getCreatedAt(),
                fact.getUpdatedAt()
        );
    }
}
