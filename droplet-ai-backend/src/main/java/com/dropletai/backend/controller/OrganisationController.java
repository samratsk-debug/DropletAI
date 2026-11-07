
package com.dropletai.backend.controller;

import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.entity.Organisation;
import com.dropletai.backend.entity.Role;
import com.dropletai.backend.entity.User;
import com.dropletai.backend.repository.MembershipRepository;
import com.dropletai.backend.repository.OrganisationRepository;
import com.dropletai.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organisations")
public class OrganisationController {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final OrganisationRepository organisationRepository;

    public OrganisationController(
            UserRepository userRepository,
            MembershipRepository membershipRepository,
            OrganisationRepository organisationRepository
    ) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.organisationRepository = organisationRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyOrganisation(
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        Membership membership = membershipRepository
                .findByUser_Id(user.getId())
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("Organisation not found")
                );

        Organisation organisation = membership.getOrganisation();

        Map<String, Object> response = new HashMap<>();
        response.put("organisationId", organisation.getId());
        response.put("organisationName", organisation.getName());
        response.put("role", membership.getRole().name());

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMyOrganisations(
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Map<String, Object>> list = membershipRepository.findByUser_Id(user.getId())
                .stream()
                .map(m -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("organisationId", m.getOrganisation().getId());
                    item.put("organisationName", m.getOrganisation().getName());
                    item.put("role", m.getRole().name());
                    item.put("joinedAt", m.getCreatedAt());
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrganisation(
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Organisation name is required");
        }
        name = name.trim();

        if (organisationRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("An organisation with this name already exists");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Organisation org = new Organisation();
        org.setName(name);
        Organisation savedOrg = organisationRepository.save(org);

        Membership membership = new Membership();
        membership.setUser(user);
        membership.setOrganisation(savedOrg);
        membership.setRole(Role.OWNER);
        membershipRepository.save(membership);

        Map<String, Object> response = new HashMap<>();
        response.put("organisationId", savedOrg.getId());
        response.put("organisationName", savedOrg.getName());
        response.put("role", Role.OWNER.name());
        response.put("createdAt", savedOrg.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{organisationId}")
    public ResponseEntity<Map<String, Object>> getOrganisationById(
            @PathVariable UUID organisationId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Membership membership = membershipRepository.findByUser_IdAndOrganisation_Id(user.getId(), organisationId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this organisation"));

        Organisation org = membership.getOrganisation();
        Map<String, Object> response = new HashMap<>();
        response.put("organisationId", org.getId());
        response.put("organisationName", org.getName());
        response.put("role", membership.getRole().name());
        response.put("createdAt", org.getCreatedAt());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{organisationId}")
    public ResponseEntity<Map<String, Object>> updateOrganisation(
            @PathVariable UUID organisationId,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Organisation name is required");
        }
        name = name.trim();

        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Membership membership = membershipRepository.findByUser_IdAndOrganisation_Id(user.getId(), organisationId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this organisation"));

        if (membership.getRole() != Role.OWNER && membership.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only OWNER or ADMIN can update organisation details");
        }

        Organisation org = membership.getOrganisation();
        if (!org.getName().equalsIgnoreCase(name) && organisationRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("An organisation with this name already exists");
        }

        org.setName(name);
        Organisation updated = organisationRepository.save(org);

        Map<String, Object> response = new HashMap<>();
        response.put("organisationId", updated.getId());
        response.put("organisationName", updated.getName());
        response.put("role", membership.getRole().name());

        return ResponseEntity.ok(response);
    }
}
