
package com.dropletai.backend.repository;

import com.dropletai.backend.entity.Guideline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GuidelineRepository
        extends JpaRepository<Guideline, UUID> {

    List<Guideline> findByOrganisation_Id(UUID organisationId);

    List<Guideline> findByBrand_Id(UUID brandId);

    List<Guideline> findByOrganisation_IdAndBrandIsNull(
            UUID organisationId
    );

    boolean existsByTitleIgnoreCaseAndOrganisation_IdAndBrand_Id(
            String title,
            UUID organisationId,
            UUID brandId
    );
}
