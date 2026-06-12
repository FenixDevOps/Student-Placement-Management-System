package com.placement.system.controller;

import com.placement.system.dto.ApplicationDto;
import com.placement.system.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Job Application Module", description = "Endpoints for student job applications and admin status routing.")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit a new job application", description = "Student submits application. Validates resume presence, drive deadline, CGPA thresholds, and duplicate files.")
    public ResponseEntity<ApplicationDto> applyToJob(@RequestBody Map<String, Long> payload) {
        Long studentId = payload.get("studentId");
        Long companyId = payload.get("companyId");
        
        if (studentId == null || companyId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        ApplicationDto created = applicationService.applyToJob(studentId, companyId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/student/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Get applications submitted by a student ID", description = "Returns student application history logs.")
    public ResponseEntity<Page<ApplicationDto>> getStudentApplications(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "applicationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
        Page<ApplicationDto> applications = applicationService.getStudentApplications(id, pageable);
        return ResponseEntity.ok(applications);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get and filter all job applications (Admin only)", description = "Supports status, branch, and student/company keyword searches.")
    public ResponseEntity<Page<ApplicationDto>> searchApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "applicationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
        Page<ApplicationDto> applications = applicationService.searchApplications(status, branch, search, pageable);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update job application status (Admin only)", description = "Updates status to Shortlisted, Selected, Rejected, etc., and issues student notification updates.")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ApplicationDto updated = applicationService.updateApplicationStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
