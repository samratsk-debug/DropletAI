
package com.dropletai.backend.repository;

import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.entity.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MembershipRepository
        extends JpaRepository<Membership, UUID> {

    List<Membership> findByUser_Id(UUID userId);

    List<Membership> findByOrganisation_Id(UUID organisationId);

    Optional<Membership> findByUser_IdAndOrganisation_Id(
            UUID userId,
            UUID organisationId
    );

    boolean existsByUser_IdAndOrganisation_Id(
            UUID userId,
            UUID organisationId
    );

    List<Membership> findByOrganisation_IdAndRole(
            UUID organisationId,
            Role role
    );
}
