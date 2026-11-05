package com.dropletai.backend.repository;

import com.dropletai.backend.entity.AnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, UUID> {

    Optional<AnalysisReport> findBySubmission_Id(UUID submissionId);
}
