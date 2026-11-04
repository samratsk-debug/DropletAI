
package com.dropletai.backend.repository;

import com.dropletai.backend.entity.Organisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrganisationRepository
        extends JpaRepository<Organisation, UUID> {

    boolean existsByNameIgnoreCase(String name);
}
