package com.placement.system.service;

import com.placement.system.dto.ApplicationDto;
import com.placement.system.exception.BadRequestException;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.model.*;
import com.placement.system.repository.ApplicationRepository;
import com.placement.system.repository.CompanyRepository;
import com.placement.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.Map;
import java.util.Locale;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ResumeParserService resumeParserService;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ApplicationDto applyToJob(Long studentId, Long companyId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID " + studentId));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID " + companyId));

        // 1. Verify student has uploaded a resume
        if (student.getResumeUrl() == null || student.getResumeUrl().trim().isEmpty()) {
            throw new BadRequestException("You must upload your resume in your profile before applying for jobs.");
        }

        // 2. Check application deadline
        if (company.getLastDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("The application deadline for this company has already passed.");
        }

        // 3. Verify student meets eligibility criteria (CGPA check)
        if (student.getCgpa() != null && company.getEligibilityCriteria() != null &&
            student.getCgpa().compareTo(company.getEligibilityCriteria()) < 0) {
            throw new BadRequestException(String.format(
                    "You do not meet the minimum CGPA eligibility criteria for this role. Required: %s, Your CGPA: %s",
                    company.getEligibilityCriteria(), student.getCgpa()
            ));
        }

        // 4. Check if student has already applied to this company
        if (applicationRepository.existsByStudentStudentIdAndCompanyCompanyId(studentId, companyId)) {
            throw new BadRequestException("You have already applied for this job opportunity.");
        }

        // Calculate match score
        String combinedSkills = student.getSkills();
        if (student.getExtractedSkills() != null && !student.getExtractedSkills().isEmpty()) {
            combinedSkills = (combinedSkills != null ? combinedSkills + ", " : "") + student.getExtractedSkills();
        }
        int matchScore = resumeParserService.calculateMatchScore(
                combinedSkills, company.getDescription(),
                student.getCgpa(), company.getEligibilityCriteria());

        Application application = Application.builder()
                .student(student)
                .company(company)
                .status(ApplicationStatus.APPLIED)
                .matchScore(matchScore)
                .build();

        Application saved = applicationRepository.save(application);

        // Send application confirmation email
        emailService.sendEmail(
                student.getEmail(),
                "Application Submitted Successfully - " + company.getCompanyName(),
                String.format(
                        "Dear %s,\n\n" +
                        "Your application for the position of '%s' at '%s' has been successfully submitted.\n\n" +
                        "Details:\n" +
                        "Company: %s\n" +
                        "Role: %s\n" +
                        "Salary Package: %s LPA\n" +
                        "Date Applied: %s\n\n" +
                        "You can track your application status via the Student Placement Management System dashboard.\n\n" +
                        "Best regards,\n" +
                        "Placement Cell",
                        student.getName(), company.getRole(), company.getCompanyName(),
                        company.getCompanyName(), company.getRole(), company.getPackageAmount(),
                        LocalDate.now()
                )
        );

        return mapToDto(saved);
    }

    public Page<ApplicationDto> getStudentApplications(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with ID " + studentId);
        }
        return applicationRepository.findByStudentStudentId(studentId, pageable)
                .map(this::mapToDto);
    }

    public Page<ApplicationDto> getCompanyApplications(Long companyId, Pageable pageable) {
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company not found with ID " + companyId);
        }
        return applicationRepository.findByCompanyCompanyId(companyId, pageable)
                .map(this::mapToDto);
    }

    public Page<ApplicationDto> searchApplications(String statusStr, String branch, String search, Pageable pageable) {
        ApplicationStatus status = null;
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                status = ApplicationStatus.valueOf(statusStr.toUpperCase().replace(" ", "_"));
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid application status: " + statusStr);
            }
        }
        return applicationRepository.searchApplications(status, branch, search, pageable)
                .map(this::mapToDto);
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, String statusStr) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID " + applicationId));

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(statusStr.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid application status: " + statusStr);
        }

        application.setStatus(newStatus);
        Application updated = applicationRepository.save(application);

        // Notify Student via email
        emailService.sendApplicationStatusUpdate(
                application.getStudent().getName(),
                application.getStudent().getEmail(),
                application.getCompany().getCompanyName(),
                application.getCompany().getRole(),
                newStatus.toString()
        );

        // Broadcast real-time WebSocket notification
        if (messagingTemplate != null) {
            try {
                Long studentId = application.getStudent().getStudentId();
                Map<String, Object> payload = Map.of(
                        "applicationId", updated.getApplicationId(),
                        "companyName", application.getCompany().getCompanyName(),
                        "role", application.getCompany().getRole(),
                        "newStatus", newStatus.toString(),
                        "message", String.format("Your application to %s (%s) has been updated to: %s",
                                application.getCompany().getCompanyName(),
                                application.getCompany().getRole(),
                                newStatus.toString())
                );
                messagingTemplate.convertAndSend("/topic/notifications/student/" + studentId, payload);
            } catch (Exception e) {
                System.err.println("WebSocket notification failed: " + e.getMessage());
            }
        }

        return mapToDto(updated);
    }

    public ApplicationDto mapToDto(Application app) {
        return ApplicationDto.builder()
                .applicationId(app.getApplicationId())
                .studentId(app.getStudent().getStudentId())
                .studentName(app.getStudent().getName())
                .studentEmail(app.getStudent().getEmail())
                .studentBranch(app.getStudent().getBranch())
                .studentCgpa(app.getStudent().getCgpa())
                .studentResumeUrl(app.getStudent().getResumeUrl())
                .companyId(app.getCompany().getCompanyId())
                .companyName(app.getCompany().getCompanyName())
                .companyRole(app.getCompany().getRole())
                .companyPackage(app.getCompany().getPackageAmount())
                .status(app.getStatus().name())
                .matchScore(app.getMatchScore())
                .studentSkills(app.getStudent().getSkills())
                .companyDescription(app.getCompany().getDescription())
                .applicationDate(app.getApplicationDate())
                .build();
    }
}
