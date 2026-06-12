package com.placement.system.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String password; // BCrypt hashed password

    @Column(length = 20)
    private String phone;

    @Column(precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(length = 50)
    private String branch;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(columnDefinition = "TEXT")
    private String skills; // Stored as a comma-separated list of skills

    @Column(name = "extracted_skills", columnDefinition = "TEXT")
    private String extractedSkills; // AI-parsed skills from resume PDF

    @Column(name = "resume_url", length = 512)
    private String resumeUrl; // Resume file URL on AWS S3 or Local directory path
}
