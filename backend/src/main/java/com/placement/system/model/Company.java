package com.placement.system.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(nullable = false, length = 100)
    private String role;

    @Column(name = "package", precision = 10, scale = 2)
    private BigDecimal packageAmount; // Compensation package in LPA

    @Column(name = "eligibility_criteria", precision = 4, scale = 2)
    private BigDecimal eligibilityCriteria; // Minimum CGPA required

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "last_date", nullable = false)
    private LocalDate lastDate;
}
