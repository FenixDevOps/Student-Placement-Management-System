package com.placement.system.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be at least 6 characters")
    private String password;

    private String phone;

    @DecimalMin(value = "0.00", message = "CGPA cannot be less than 0")
    @DecimalMax(value = "10.00", message = "CGPA cannot be greater than 10")
    private BigDecimal cgpa;

    private String branch;

    private Integer graduationYear;

    private String skills;
}
