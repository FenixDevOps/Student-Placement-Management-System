package com.placement.system.service;

import com.placement.system.dto.ApplicationDto;
import com.placement.system.exception.BadRequestException;
import com.placement.system.model.*;
import com.placement.system.repository.ApplicationRepository;
import com.placement.system.repository.CompanyRepository;
import com.placement.system.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ApplicationService applicationService;

    private Student eligibleStudent;
    private Company typicalCompany;

    @BeforeEach
    void setUp() {
        eligibleStudent = Student.builder()
                .studentId(10L)
                .name("Alex Mercer")
                .email("alex@university.edu")
                .cgpa(new BigDecimal("9.00"))
                .branch("CSE")
                .resumeUrl("/uploads/resumes/alex_resume.pdf")
                .build();

        typicalCompany = Company.builder()
                .companyId(5L)
                .companyName("TechCorp")
                .role("Developer")
                .packageAmount(new BigDecimal("12.50"))
                .eligibilityCriteria(new BigDecimal("8.00"))
                .lastDate(LocalDate.now().plusDays(5))
                .build();
    }

    @Test
    void applyToJob_ShouldThrow_WhenNoResumeUploaded() {
        eligibleStudent.setResumeUrl(null);

        when(studentRepository.findById(10L)).thenReturn(Optional.of(eligibleStudent));
        when(companyRepository.findById(5L)).thenReturn(Optional.of(typicalCompany));

        assertThrows(BadRequestException.class, () -> {
            applicationService.applyToJob(10L, 5L);
        });

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void applyToJob_ShouldThrow_WhenCgpaIneligible() {
        eligibleStudent.setCgpa(new BigDecimal("7.50")); // Company requires 8.00

        when(studentRepository.findById(10L)).thenReturn(Optional.of(eligibleStudent));
        when(companyRepository.findById(5L)).thenReturn(Optional.of(typicalCompany));

        assertThrows(BadRequestException.class, () -> {
            applicationService.applyToJob(10L, 5L);
        });

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void applyToJob_ShouldThrow_WhenDeadlinePassed() {
        typicalCompany.setLastDate(LocalDate.now().minusDays(1)); // Deadline yesterday

        when(studentRepository.findById(10L)).thenReturn(Optional.of(eligibleStudent));
        when(companyRepository.findById(5L)).thenReturn(Optional.of(typicalCompany));

        assertThrows(BadRequestException.class, () -> {
            applicationService.applyToJob(10L, 5L);
        });

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void applyToJob_ShouldSucceed_WhenEligible() {
        when(studentRepository.findById(10L)).thenReturn(Optional.of(eligibleStudent));
        when(companyRepository.findById(5L)).thenReturn(Optional.of(typicalCompany));
        when(applicationRepository.existsByStudentStudentIdAndCompanyCompanyId(10L, 5L)).thenReturn(false);
        
        Application mockApp = Application.builder()
                .applicationId(1L)
                .student(eligibleStudent)
                .company(typicalCompany)
                .status(ApplicationStatus.APPLIED)
                .build();
                
        when(applicationRepository.save(any(Application.class))).thenReturn(mockApp);

        ApplicationDto result = applicationService.applyToJob(10L, 5L);

        assertNotNull(result);
        assertEquals("APPLIED", result.getStatus());
        assertEquals("Alex Mercer", result.getStudentName());
        assertEquals("TechCorp", result.getCompanyName());
        
        verify(applicationRepository, times(1)).save(any(Application.class));
        verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString());
    }
}
