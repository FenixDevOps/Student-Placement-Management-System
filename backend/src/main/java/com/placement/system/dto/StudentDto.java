package com.placement.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDto {
    private Long studentId;
    private String name;
    private String email;
    private String phone;
    private BigDecimal cgpa;
    private String branch;
    private Integer graduationYear;
    private String skills;
    private String extractedSkills;
    private String resumeUrl;
}
