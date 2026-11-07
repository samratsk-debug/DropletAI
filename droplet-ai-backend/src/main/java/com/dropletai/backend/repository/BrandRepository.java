
package com.dropletai.backend.repository;

import com.dropletai.backend.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BrandRepository
        extends JpaRepository<Brand, UUID> {

    List<Brand> findByOrganisation_Id(UUID organisationId);

    boolean existsByNameIgnoreCaseAndOrganisation_Id(
            String name,
            UUID organisationId
    );
}
