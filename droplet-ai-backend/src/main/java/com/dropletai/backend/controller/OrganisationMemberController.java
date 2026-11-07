
package com.dropletai.backend.controller;

import com.dropletai.backend.dto.AddMemberRequest;
import com.dropletai.backend.dto.UpdateMemberRoleRequest;
import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.service.OrganisationMemberService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organisations")
public class OrganisationMemberController {

    private final OrganisationMemberService memberService;

    public OrganisationMemberController(
            OrganisationMemberService memberService
    ) {
        this.memberService = memberService;
    }

    // ADD TEAM MEMBER
    @PostMapping("/{organisationId}/members")
    public ResponseEntity<Map<String, Object>> addMember(
            @PathVariable UUID organisationId,
            @Valid @RequestBody AddMemberRequest request,
            Authentication authentication
    ) {

        Membership membership = memberService.addMember(
                organisationId,
                authentication.getName(),
                request
        );

        Map<String, Object> response = Map.of(
                "message", "Team member added successfully",
                "membershipId", membership.getId(),
                "userId", membership.getUser().getId(),
                "email", membership.getUser().getEmail(),
                "role", membership.getRole().name(),
                "organisationId", membership.getOrganisation().getId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET ORGANISATION MEMBERS
    @GetMapping("/{organisationId}/members")
    public ResponseEntity<List<Map<String, Object>>> getMembers(
            @PathVariable UUID organisationId,
            Authentication authentication
    ) {

        List<Map<String, Object>> members =
                memberService.getMembers(
                                organisationId,
                                authentication.getName()
                        ).stream()
                        .map(membership -> Map.<String, Object>of(
                                "membershipId", membership.getId(),
                                "userId", membership.getUser().getId(),
                                "fullName", membership.getUser().getFullName(),
                                "email", membership.getUser().getEmail(),
                                "role", membership.getRole().name()
                        ))
                        .collect(Collectors.toList());

        return ResponseEntity.ok(members);
    }

    // UPDATE MEMBER ROLE
    @PutMapping("/{organisationId}/members/{membershipId}/role")
    public ResponseEntity<Map<String, Object>> updateMemberRole(
            @PathVariable UUID organisationId,
            @PathVariable UUID membershipId,
            @Valid @RequestBody UpdateMemberRoleRequest request,
            Authentication authentication
    ) {

        Membership updated = memberService.updateMemberRole(
                organisationId,
                membershipId,
                authentication.getName(),
                request.getRole()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Member role updated successfully",
                "membershipId", updated.getId(),
                "role", updated.getRole().name()
        ));
    }

    @DeleteMapping("/{organisationId}/members/{membershipId}")
    public ResponseEntity<Map<String, Object>> removeMember(
            @PathVariable UUID organisationId,
            @PathVariable UUID membershipId,
            Authentication authentication
    ) {
        memberService.removeMember(
                organisationId,
                membershipId,
                authentication.getName()
        );

        return ResponseEntity.ok(
                Map.of("message", "Team member removed successfully")
        );
    }

}
