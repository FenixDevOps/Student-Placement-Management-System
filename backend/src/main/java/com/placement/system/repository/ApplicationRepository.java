package com.placement.system.repository;

import com.placement.system.model.Application;
import com.placement.system.model.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByStudentStudentId(Long studentId, Pageable pageable);
    
    Page<Application> findByCompanyCompanyId(Long companyId, Pageable pageable);
    
    boolean existsByStudentStudentIdAndCompanyCompanyId(Long studentId, Long companyId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = :status")
    long countByStatus(@Param("status") ApplicationStatus status);

    @Query("SELECT MAX(c.packageAmount) FROM Application a JOIN a.company c WHERE a.status = com.placement.system.model.ApplicationStatus.SELECTED")
    BigDecimal findHighestSelectedPackage();

    @Query("SELECT AVG(c.packageAmount) FROM Application a JOIN a.company c WHERE a.status = com.placement.system.model.ApplicationStatus.SELECTED")
    Double findAverageSelectedPackage();

    @Query("SELECT COUNT(DISTINCT a.student.studentId) FROM Application a WHERE a.status = com.placement.system.model.ApplicationStatus.SELECTED")
    long countDistinctSelectedStudents();

    @Query("SELECT a.student.branch, COUNT(a) FROM Application a WHERE a.status = com.placement.system.model.ApplicationStatus.SELECTED GROUP BY a.student.branch")
    List<Object[]> findSelectedCountByBranch();

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> findApplicationCountByStatus();
    
    @Query("SELECT s.branch, COUNT(s) FROM Student s GROUP BY s.branch")
    List<Object[]> findStudentCountByBranch();

    @Query("SELECT a FROM Application a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:branch IS NULL OR TRIM(:branch) = '' OR LOWER(a.student.branch) = LOWER(TRIM(:branch))) AND " +
           "(:search IS NULL OR TRIM(:search) = '' OR " +
           " LOWER(a.student.name) LIKE LOWER(CONCAT('%', TRIM(:search), '%')) OR " +
           " LOWER(a.company.companyName) LIKE LOWER(CONCAT('%', TRIM(:search), '%')) OR " +
           " LOWER(a.company.role) LIKE LOWER(CONCAT('%', TRIM(:search), '%')))")
    Page<Application> searchApplications(
            @Param("status") ApplicationStatus status,
            @Param("branch") String branch,
            @Param("search") String search,
            Pageable pageable
    );
}
