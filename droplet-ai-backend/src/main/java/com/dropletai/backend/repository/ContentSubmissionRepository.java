package com.dropletai.backend.repository;

import com.dropletai.backend.entity.ContentSubmission;
import com.dropletai.backend.entity.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContentSubmissionRepository extends JpaRepository<ContentSubmission, UUID> {

    List<ContentSubmission> findByOrganisation_Id(UUID organisationId);

    List<ContentSubmission> findByBrand_Id(UUID brandId);

    List<ContentSubmission> findByOrganisation_IdAndStatus(UUID organisationId, ContentStatus status);
}
