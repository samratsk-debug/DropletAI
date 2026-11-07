
package com.dropletai.backend.service;

import com.dropletai.backend.dto.AddMemberRequest;
import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.entity.Organisation;
import com.dropletai.backend.entity.Role;
import com.dropletai.backend.entity.User;

import com.dropletai.backend.repository.MembershipRepository;
import com.dropletai.backend.repository.OrganisationRepository;
import com.dropletai.backend.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class OrganisationMemberService {

    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final MembershipRepository membershipRepository;

    public OrganisationMemberService(
            UserRepository userRepository,
            OrganisationRepository organisationRepository,
            MembershipRepository membershipRepository
    ) {
        this.userRepository = userRepository;
        this.organisationRepository = organisationRepository;
        this.membershipRepository = membershipRepository;
    }

    // ADD TEAM MEMBER
    @Transactional
    public Membership addMember(
            UUID organisationId,
            String actorEmail,
            AddMemberRequest request
    ) {

        String actorEmailNormalized =
                actorEmail.trim().toLowerCase(Locale.ROOT);

        String memberEmail =
                request.getEmail().trim().toLowerCase(Locale.ROOT);

        User actor = userRepository.findByEmailIgnoreCase(actorEmailNormalized)
                .orElseThrow(() ->
                        new IllegalArgumentException("Requesting user not found")
                );

        User newMember = userRepository.findByEmailIgnoreCase(memberEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "This user is not registered yet"
                        )
                );

        Organisation organisation = organisationRepository
                .findById(organisationId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Organisation not found")
                );

        Membership actorMembership = membershipRepository
                .findByUser_IdAndOrganisation_Id(
                        actor.getId(),
                        organisationId
                )
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "You are not a member of this organisation"
                        )
                );

        Role actorRole = actorMembership.getRole();
        Role requestedRole = request.getRole();

        if (requestedRole == null || requestedRole == Role.OWNER) {
            throw new AccessDeniedException(
                    "OWNER cannot be assigned through this endpoint"
            );
        }

        if (actorRole != Role.OWNER && actorRole != Role.ADMIN) {
            throw new AccessDeniedException(
                    "Only OWNER or ADMIN can add team members"
            );
        }

        if (actorRole == Role.ADMIN && requestedRole == Role.ADMIN) {
            throw new AccessDeniedException(
                    "Only OWNER can assign the ADMIN role"
            );
        }

        if (membershipRepository.existsByUser_IdAndOrganisation_Id(
                newMember.getId(),
                organisationId
        )) {
            throw new IllegalArgumentException(
                    "This user is already a member of the organisation"
            );
        }

        Membership membership = new Membership();

        membership.setUser(newMember);
        membership.setOrganisation(organisation);
        membership.setRole(requestedRole);

        return membershipRepository.save(membership);
    }

    // GET ALL ORGANISATION MEMBERS
    @Transactional(readOnly = true)
    public List<Membership> getMembers(
            UUID organisationId,
            String actorEmail
    ) {

        User actor = userRepository.findByEmailIgnoreCase(
                actorEmail.trim()
        ).orElseThrow(() ->
                new IllegalArgumentException("User not found")
        );

        membershipRepository.findByUser_IdAndOrganisation_Id(
                actor.getId(),
                organisationId
        ).orElseThrow(() ->
                new AccessDeniedException(
                        "You are not a member of this organisation"
                )
        );

        return membershipRepository.findByOrganisation_Id(organisationId);
    }

    // UPDATE TEAM MEMBER ROLE
    @Transactional
    public Membership updateMemberRole(
            UUID organisationId,
            UUID membershipId,
            String actorEmail,
            Role newRole
    ) {

        User actor = userRepository.findByEmailIgnoreCase(
                actorEmail.trim()
        ).orElseThrow(() ->
                new IllegalArgumentException("User not found")
        );

        Membership actorMembership =
                membershipRepository.findByUser_IdAndOrganisation_Id(
                        actor.getId(),
                        organisationId
                ).orElseThrow(() ->
                        new AccessDeniedException(
                                "You are not a member of this organisation"
                        )
                );

        if (actorMembership.getRole() != Role.OWNER) {
            throw new AccessDeniedException(
                    "Only OWNER can change member roles"
            );
        }

        if (newRole == null || newRole == Role.OWNER) {
            throw new IllegalArgumentException(
                    "OWNER cannot be assigned through this endpoint"
            );
        }

        Membership target = membershipRepository.findById(membershipId)
                .filter(membership ->
                        membership.getOrganisation().getId()
                                .equals(organisationId)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found")
                );

        if (target.getRole() == Role.OWNER) {
            throw new IllegalArgumentException(
                    "The OWNER role cannot be changed here"
            );
        }

        target.setRole(newRole);

        return membershipRepository.save(target);
    }
    @Transactional
    public void removeMember(
            UUID organisationId,
            UUID membershipId,
            String actorEmail
    ) {
        User actor = userRepository.findByEmailIgnoreCase(
                actorEmail.trim()
        ).orElseThrow(() ->
                new IllegalArgumentException("User not found")
        );

        Membership actorMembership =
                membershipRepository.findByUser_IdAndOrganisation_Id(
                        actor.getId(), organisationId
                ).orElseThrow(() ->
                        new AccessDeniedException(
                                "You are not a member of this organisation"
                        )
                );

        if (actorMembership.getRole() != Role.OWNER) {
            throw new AccessDeniedException(
                    "Only OWNER can remove team members"
            );
        }

        Membership target = membershipRepository.findById(membershipId)
                .filter(member ->
                        member.getOrganisation().getId().equals(organisationId)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found")
                );

        if (target.getRole() == Role.OWNER) {
            throw new IllegalArgumentException(
                    "The OWNER cannot be removed"
            );
        }

        membershipRepository.delete(target);
    }
}
