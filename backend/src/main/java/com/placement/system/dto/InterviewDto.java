package com.placement.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewDto {
    private Long interviewId;
    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long companyId;
    private String companyName;
    private String companyRole;
    private LocalDateTime scheduledTime;
    private Integer durationMinutes;
    private String roundName;
    private String locationOrLink;
    private String notes;
    private LocalDateTime createdAt;
}
