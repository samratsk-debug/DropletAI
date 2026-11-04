
package com.dropletai.backend.controller;

import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.entity.Organisation;
import com.dropletai.backend.repository.MembershipRepository;
import com.dropletai.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/organisations")
public class OrganisationController {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    public OrganisationController(
            UserRepository userRepository,
            MembershipRepository membershipRepository
    ) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyOrganisation(
            Authentication authentication
    ) {

        String email = authentication.getName();

        var user = userRepository.findByEmail(email)
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
}
