package com.placement.system.repository;

import com.placement.system.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByEmail(String email);
    
    @Query("SELECT s FROM Student s WHERE " +
           "(:branch IS NULL OR TRIM(:branch) = '' OR LOWER(s.branch) = LOWER(TRIM(:branch))) AND " +
           "(:minCgpa IS NULL OR s.cgpa >= :minCgpa) AND " +
           "(:search IS NULL OR TRIM(:search) = '' OR " +
           " LOWER(s.name) LIKE LOWER(CONCAT('%', TRIM(:search), '%')) OR " +
           " LOWER(s.skills) LIKE LOWER(CONCAT('%', TRIM(:search), '%')) OR " +
           " LOWER(s.email) LIKE LOWER(CONCAT('%', TRIM(:search), '%')))")
    Page<Student> searchStudents(
            @Param("branch") String branch,
            @Param("minCgpa") BigDecimal minCgpa,
            @Param("search") String search,
            Pageable pageable
    );
}
