package com.placement.system.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {
    private Long companyId;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job role is required")
    private String role;

    @NotNull(message = "Package amount is required")
    @DecimalMin(value = "0.0", message = "Package must be positive")
    private BigDecimal packageAmount;

    @NotNull(message = "Eligibility criteria (Min CGPA) is required")
    @DecimalMin(value = "0.0", message = "CGPA criteria cannot be less than 0")
    @DecimalMax(value = "10.0", message = "CGPA criteria cannot exceed 10")
    private BigDecimal eligibilityCriteria;

    private String description;

    @NotNull(message = "Last date to apply is required")
    private LocalDate lastDate;
}
