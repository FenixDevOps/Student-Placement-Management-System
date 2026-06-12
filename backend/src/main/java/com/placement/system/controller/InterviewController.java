package com.placement.system.controller;

import com.placement.system.dto.InterviewDto;
import com.placement.system.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@Tag(name = "Interview Module", description = "Endpoints for scheduling and managing placement interviews.")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Schedule a new interview (Admin only)")
    public ResponseEntity<InterviewDto> scheduleInterview(@Valid @RequestBody InterviewDto dto) {
        InterviewDto created = interviewService.scheduleInterview(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Get all interviews for a student")
    public ResponseEntity<List<InterviewDto>> getStudentInterviews(@PathVariable Long studentId) {
        List<InterviewDto> interviews = interviewService.getStudentInterviews(studentId);
        return ResponseEntity.ok(interviews);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all interviews (Admin only)")
    public ResponseEntity<Page<InterviewDto>> getAllInterviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "scheduledTime"));
        Page<InterviewDto> interviews = interviewService.getAllInterviews(pageable);
        return ResponseEntity.ok(interviews);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update/reschedule an interview (Admin only)")
    public ResponseEntity<InterviewDto> updateInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewDto dto
    ) {
        InterviewDto updated = interviewService.updateInterview(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cancel/delete an interview (Admin only)")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
