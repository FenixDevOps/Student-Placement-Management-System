package com.placement.system.controller;

import com.placement.system.dto.StudentDto;
import com.placement.system.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Student Module", description = "Endpoints for student profiles search, details lookups, profile editing, and PDF resumes uploading.")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get a paginated list of Students (Admin only)", description = "Allows sorting, searching, and filtering by branch and minimum CGPA criteria.")
    public ResponseEntity<Page<StudentDto>> getAllStudents(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) BigDecimal minCgpa,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
        Page<StudentDto> students = studentService.getAllStudents(branch, minCgpa, search, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Get a Student profile details by ID", description = "Allows administrators and the student themselves to retrieve profile settings.")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')") // Admins can also update student info if required, but primarily for students
    @Operation(summary = "Update Student profile details", description = "Saves contact details, scores, academic branch, and skills inventory.")
    public ResponseEntity<StudentDto> updateStudentProfile(
            @PathVariable Long id,
            @RequestBody StudentDto dto
    ) {
        StudentDto updated = studentService.updateStudentProfile(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping(value = "/{id}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Upload Student resume PDF file", description = "Accepts a PDF multipart file, uploads it to S3 (or local fallback folder), and updates the student's resume URL.")
    public ResponseEntity<StudentDto> uploadResume(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        StudentDto updated = studentService.uploadStudentResume(id, file);
        return ResponseEntity.ok(updated);
    }
}
