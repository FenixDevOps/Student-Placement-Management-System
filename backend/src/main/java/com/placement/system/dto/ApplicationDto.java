package com.placement.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {
    private Long applicationId;
    
    // Student Details
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentBranch;
    private BigDecimal studentCgpa;
    private String studentResumeUrl;

    // Company Details
    private Long companyId;
    private String companyName;
    private String companyRole;
    private BigDecimal companyPackage;

    // Application Details
    private String status;
    private Integer matchScore;
    private String studentSkills;
    private String companyDescription;
    private LocalDateTime applicationDate;
}
