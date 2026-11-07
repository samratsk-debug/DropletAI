
package com.dropletai.backend.service;

import com.dropletai.backend.dto.BrandRequest;
import com.dropletai.backend.dto.BrandResponse;
import com.dropletai.backend.entity.Brand;
import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.entity.Organisation;
import com.dropletai.backend.entity.User;
import com.dropletai.backend.repository.BrandRepository;
import com.dropletai.backend.repository.MembershipRepository;
import com.dropletai.backend.repository.OrganisationRepository;
import com.dropletai.backend.repository.UserRepository;
import com.dropletai.backend.entity.Role;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class BrandService {

    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final MembershipRepository membershipRepository;

    public BrandService(
            BrandRepository brandRepository,
            UserRepository userRepository,
            OrganisationRepository organisationRepository,
            MembershipRepository membershipRepository
    ) {
        this.brandRepository = brandRepository;
        this.userRepository = userRepository;
        this.organisationRepository = organisationRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional
    public BrandResponse createBrand(
            UUID organisationId,
            String actorEmail,
            BrandRequest request
    ) {
        User actor = findUser(actorEmail);

        Membership membership = findMembership(
                actor.getId(), organisationId
        );

        if (membership.getRole() == null) {
            throw new AccessDeniedException("Invalid organisation role");
        }

        String brandName = request.getName().trim();

        if (brandRepository.existsByNameIgnoreCaseAndOrganisation_Id(
                brandName, organisationId
        )) {
            throw new IllegalArgumentException(
                    "A brand with this name already exists"
            );
        }

        Organisation organisation = organisationRepository
                .findById(organisationId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Organisation not found"
                        )
                );

        Brand brand = new Brand();
        brand.setName(brandName);
        brand.setDescription(request.getDescription());
        brand.setOrganisation(organisation);

        return toResponse(brandRepository.save(brand));
    }

    @Transactional(readOnly = true)
    public List<BrandResponse> getBrands(
            UUID organisationId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);

        findMembership(actor.getId(), organisationId);

        return brandRepository.findByOrganisation_Id(organisationId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private User findUser(String email) {
        return userRepository.findByEmailIgnoreCase(
                email.trim()
        ).orElseThrow(() ->
                new IllegalArgumentException("User not found")
        );
    }

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

    private BrandResponse toResponse(Brand brand) {
        return new BrandResponse(
                brand.getId(),
                brand.getName(),
                brand.getDescription(),
                brand.getOrganisation().getId(),
                brand.getCreatedAt()
        );
    }

    @Transactional
    public BrandResponse updateBrand(
            UUID organisationId,
            UUID brandId,
            String actorEmail,
            BrandRequest request
    ) {
        User actor = findUser(actorEmail);

        Membership membership = findMembership(
                actor.getId(), organisationId
        );

        if (membership.getRole() != Role.OWNER
                && membership.getRole() != Role.ADMIN) {
            throw new AccessDeniedException(
                    "Only OWNER or ADMIN can update brands"
            );
        }

        Brand brand = brandRepository.findById(brandId)
                .filter(existing ->
                        existing.getOrganisation().getId()
                                .equals(organisationId)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException("Brand not found")
                );

        String brandName = request.getName().trim();

        boolean duplicate = brandRepository
                .existsByNameIgnoreCaseAndOrganisation_Id(
                        brandName, organisationId
                );

        if (duplicate && !brand.getName().equalsIgnoreCase(brandName)) {
            throw new IllegalArgumentException(
                    "A brand with this name already exists"
            );
        }

        brand.setName(brandName);
        brand.setDescription(request.getDescription());

        return toResponse(brandRepository.save(brand));
    }

    @Transactional
    public void deleteBrand(
            UUID organisationId,
            UUID brandId,
            String actorEmail
    ) {
        User actor = findUser(actorEmail);

        Membership membership = findMembership(
                actor.getId(), organisationId
        );

        if (membership.getRole() != Role.OWNER
                && membership.getRole() != Role.ADMIN) {
            throw new AccessDeniedException(
                    "Only OWNER or ADMIN can delete brands"
            );
        }

        Brand brand = brandRepository.findById(brandId)
                .filter(existing ->
                        existing.getOrganisation().getId()
                                .equals(organisationId)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException("Brand not found")
                );

        brandRepository.delete(brand);
    }

}
