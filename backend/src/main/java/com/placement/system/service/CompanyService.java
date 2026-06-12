package com.placement.system.service;

import com.placement.system.dto.CompanyDto;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.model.Company;
import com.placement.system.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public Page<CompanyDto> getAllCompanies(String search, BigDecimal minPackage, BigDecimal maxEligibility, Pageable pageable) {
        return companyRepository.searchCompanies(search, minPackage, maxEligibility, pageable)
                .map(this::mapToDto);
    }

    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID " + id));
        return mapToDto(company);
    }

    public CompanyDto createCompany(CompanyDto dto) {
        Company company = Company.builder()
                .companyName(dto.getCompanyName())
                .role(dto.getRole())
                .packageAmount(dto.getPackageAmount())
                .eligibilityCriteria(dto.getEligibilityCriteria())
                .description(dto.getDescription())
                .lastDate(dto.getLastDate())
                .build();
        
        Company saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    public CompanyDto updateCompany(Long id, CompanyDto dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID " + id));

        company.setCompanyName(dto.getCompanyName());
        company.setRole(dto.getRole());
        company.setPackageAmount(dto.getPackageAmount());
        company.setEligibilityCriteria(dto.getEligibilityCriteria());
        company.setDescription(dto.getDescription());
        company.setLastDate(dto.getLastDate());

        Company updated = companyRepository.save(company);
        return mapToDto(updated);
    }

    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found with ID " + id);
        }
        companyRepository.deleteById(id);
    }

    public CompanyDto mapToDto(Company company) {
        return CompanyDto.builder()
                .companyId(company.getCompanyId())
                .companyName(company.getCompanyName())
                .role(company.getRole())
                .packageAmount(company.getPackageAmount())
                .eligibilityCriteria(company.getEligibilityCriteria())
                .description(company.getDescription())
                .lastDate(company.getLastDate())
                .build();
    }
}
