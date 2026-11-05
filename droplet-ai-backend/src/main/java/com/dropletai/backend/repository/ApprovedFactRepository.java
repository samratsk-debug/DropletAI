package com.dropletai.backend.repository;

import com.dropletai.backend.entity.ApprovedFact;
import com.dropletai.backend.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApprovedFactRepository extends JpaRepository<ApprovedFact, UUID> {

    List<ApprovedFact> findByOrganisation_Id(UUID organisationId);

    List<ApprovedFact> findByOrganisation_IdAndVerificationStatus(UUID organisationId, VerificationStatus verificationStatus);

    List<ApprovedFact> findByBrand_Id(UUID brandId);

    List<ApprovedFact> findByBrand_IdAndVerificationStatus(UUID brandId, VerificationStatus verificationStatus);

    List<ApprovedFact> findByOrganisation_IdAndBrandIsNull(UUID organisationId);
}
