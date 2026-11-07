
package com.dropletai.backend.service;

import com.dropletai.backend.dto.GuidelineRequest;
import com.dropletai.backend.dto.GuidelineResponse;
import com.dropletai.backend.entity.Brand;
import com.dropletai.backend.entity.Guideline;
import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.entity.Organisation;
import com.dropletai.backend.entity.Role;
import com.dropletai.backend.entity.User;

import com.dropletai.backend.repository.BrandRepository;
import com.dropletai.backend.repository.GuidelineRepository;
import com.dropletai.backend.repository.MembershipRepository;
import com.dropletai.backend.repository.OrganisationRepository;
import com.dropletai.backend.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.Objects;

@Service
public class GuidelineService {

    private final GuidelineRepository guidelineRepository;
    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final MembershipRepository membershipRepository;
    private final BrandRepository brandRepository;

    public GuidelineService(
            GuidelineRepository guidelineRepository,
            UserRepository userRepository,
            OrganisationRepository organisationRepository,
            MembershipRepository membershipRepository,
            BrandRepository brandRepository
    ) {
        this.guidelineRepository = guidelineRepository;
        this.userRepository = userRepository;
        this.organisationRepository = organisationRepository;
        this.membershipRepository = membershipRepository;
        this.brandRepository = brandRepository;
    }

    // CREATE GUIDELINE
    @Transactional
    public GuidelineResponse createGuideline(
            UUID organisationId,
            String actorEmail,
            GuidelineRequest request
    ) {
        User actor = findUser(actorEmail);

        Membership membership = findMembership(
                actor.getId(), organisationId
        );

        checkEditPermission(membership);

        Organisation organisation = organisationRepository
                .findById(organisationId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Organisation not found"
                        )
                );

        Brand brand = null;

        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId())
                    .filter(existing ->
                            existing.getOrganisation().getId()
                                    .equals(organisationId)
                    )
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Brand not found in this organisation"
                            )
                    );
        }

        String title = request.getTitle().trim();

        UUID selectedBrandId =
                brand != null ? brand.getId() : null;

        boolean duplicate = guidelineRepository
                .findByOrganisation_Id(organisationId)
                .stream()
                .anyMatch(existing ->
                        existing.getTitle().equalsIgnoreCase(title)
                                && Objects.equals(
                                selectedBrandId,
                                existing.getBrand() != null
                                        ? existing.getBrand().getId()
                                        : null
                        )
                );

        if (duplicate) {
            throw new IllegalArgumentException(
                    "A guideline with this title already exists"
            );
        }

        Guideline guideline = new Guideline();

        guideline.setTitle(title);
        guideline.setContent(request.getContent().trim());
        guideline.setOrganisation(organisation);
        guideline.setBrand(brand);

        return toResponse(guidelineRepository.save(guideline));
    }

    // GET ALL GUIDELINES
    @Transactional(readOnly = true)
    public List<GuidelineResponse> getGuidelines(
            UUID organisationId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);

        findMembership(actor.getId(), organisationId);

        return guidelineRepository
                .findByOrganisation_Id(organisationId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // UPDATE GUIDELINE
    @Transactional
    public GuidelineResponse updateGuideline(
            UUID organisationId,
            UUID guidelineId,
            String actorEmail,
            GuidelineRequest request
    ) {
        User actor = findUser(actorEmail);

        Membership membership = findMembership(
                actor.getId(), organisationId
        );

        checkEditPermission(membership);

        Guideline guideline = guidelineRepository
                .findById(guidelineId)
                .filter(existing ->
                        existing.getOrganisation().getId()
                                .equals(organisationId)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Guideline not found"
                        )
                );

        Brand brand = null;

        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId())
                    .filter(existing ->
                            existing.getOrganisation().getId()
                                    .equals(organisationId)
                    )
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Brand not found in this organisation"
                            )
                    );
        }

        String title = request.getTitle().trim();

        UUID selectedBrandId =
                brand != null ? brand.getId() : null;

        boolean duplicate = guidelineRepository
                .findByOrganisation_Id(organisationId)
                .stream()
                .anyMatch(existing ->
                        !existing.getId().equals(guidelineId)
                                && existing.getTitle()
                                .equalsIgnoreCase(title)
                                && Objects.equals(
                                selectedBrandId,
                                existing.getBrand() != null
                                        ? existing.getBrand().getId()
                                        : null
                        )
                );

        if (duplicate) {
            throw new IllegalArgumentException(
                    "A guideline with this title already exists"
            );
        }

        guideline.setTitle(title);
        guideline.setContent(request.getContent().trim());
        guideline.setBrand(brand);

        return toResponse(guidelineRepository.save(guideline));
    }

    // DELETE GUIDELINE
    @Transactional
    public void deleteGuideline(
            UUID organisationId,
            UUID guidelineId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);

        Membership membership = findMembership(
                actor.getId(), organisationId
        );

        checkEditPermission(membership);

        Guideline guideline = guidelineRepository
                .findById(guidelineId)
                .filter(existing ->
                        existing.getOrganisation().getId()
                                .equals(organisationId)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Guideline not found"
                        )
                );

        guidelineRepository.delete(guideline);
    }

    // FIND USER
    private User findUser(String email) {
        return userRepository.findByEmailIgnoreCase(
                email.trim()
        ).orElseThrow(() ->
                new IllegalArgumentException("User not found")
        );
    }

    // FIND ORGANISATION MEMBERSHIP
    private Membership findMembership(
            UUID userId,
            UUID organisationId
    ) {
        return membershipRepository
                .findByUser_IdAndOrganisation_Id(
                        userId, organisationId
                )
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "You are not a member of this organisation"
                        )
                );
    }

    // CHECK EDIT PERMISSION
    private void checkEditPermission(Membership membership) {
        if (membership.getRole() != Role.OWNER
                && membership.getRole() != Role.ADMIN) {
            throw new AccessDeniedException(
                    "Only OWNER or ADMIN can manage guidelines"
            );
        }
    }

    // CONVERT ENTITY TO RESPONSE DTO
    private GuidelineResponse toResponse(Guideline guideline) {
        return new GuidelineResponse(
                guideline.getId(),
                guideline.getTitle(),
                guideline.getContent(),
                guideline.getOrganisation().getId(),
                guideline.getBrand() != null
                        ? guideline.getBrand().getId()
                        : null,
                guideline.getCreatedAt()
        );
    }
}
