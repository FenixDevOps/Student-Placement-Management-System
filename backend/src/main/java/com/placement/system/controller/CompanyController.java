package com.placement.system.controller;

import com.placement.system.dto.CompanyDto;
import com.placement.system.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Company Module", description = "Endpoints for administering company details and job postings.")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Get a list of recruitment opportunities", description = "Supports paginated search, minimum compensation filters, and maximum CGPA requirements.")
    public ResponseEntity<Page<CompanyDto>> getAllCompanies(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPackage,
            @RequestParam(required = false) BigDecimal maxEligibility,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastDate") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
        Page<CompanyDto> companies = companyService.getAllCompanies(search, minPackage, maxEligibility, pageable);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Get recruitment drive by ID", description = "Returns company details, packaging CTCs, and dates.")
    public ResponseEntity<CompanyDto> getCompanyById(@PathVariable Long id) {
        CompanyDto company = companyService.getCompanyById(id);
        return ResponseEntity.ok(company);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a company recruitment drive (Admin only)", description = "Adds a company record along with eligibilities and application deadline limits.")
    public ResponseEntity<CompanyDto> createCompany(@Valid @RequestBody CompanyDto dto) {
        CompanyDto created = companyService.createCompany(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update recruitment drive details (Admin only)", description = "Modifies description, packages, criteria, or deadlines.")
    public ResponseEntity<CompanyDto> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyDto dto
    ) {
        CompanyDto updated = companyService.updateCompany(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete recruitment drive (Admin only)", description = "Removes company profile and associated student applications.")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}
