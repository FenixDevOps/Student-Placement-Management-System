package com.placement.system.repository;

import com.placement.system.model.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c WHERE " +
           "(:search IS NULL OR TRIM(:search) = '' OR " +
           " LOWER(c.companyName) LIKE LOWER(CONCAT('%', TRIM(:search), '%')) OR " +
           " LOWER(c.role) LIKE LOWER(CONCAT('%', TRIM(:search), '%'))) AND " +
           "(:minPackage IS NULL OR c.packageAmount >= :minPackage) AND " +
           "(:maxEligibility IS NULL OR c.eligibilityCriteria <= :maxEligibility)")
    Page<Company> searchCompanies(
            @Param("search") String search,
            @Param("minPackage") BigDecimal minPackage,
            @Param("maxEligibility") BigDecimal maxEligibility,
            Pageable pageable
    );
}
