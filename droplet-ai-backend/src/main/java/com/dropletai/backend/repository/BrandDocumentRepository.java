package com.dropletai.backend.repository;

import com.dropletai.backend.entity.BrandDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BrandDocumentRepository extends JpaRepository<BrandDocument, UUID> {

    List<BrandDocument> findByOrganisation_Id(UUID organisationId);

    List<BrandDocument> findByBrand_Id(UUID brandId);

    List<BrandDocument> findByOrganisation_IdAndBrandIsNull(UUID organisationId);
}
