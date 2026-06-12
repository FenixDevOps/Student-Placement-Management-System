package com.placement.system.repository;

import com.placement.system.model.Interview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    @Query("SELECT i FROM Interview i WHERE i.application.student.studentId = :studentId ORDER BY i.scheduledTime ASC")
    List<Interview> findByStudentId(Long studentId);

    Page<Interview> findAll(Pageable pageable);

    List<Interview> findByApplicationApplicationId(Long applicationId);
}
