package com.placement.system.service;

import com.placement.system.dto.DashboardStatsDto;
import com.placement.system.dto.DashboardStatsDto.BranchStat;
import com.placement.system.dto.DashboardStatsDto.StatusStat;
import com.placement.system.model.ApplicationStatus;
import com.placement.system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class StatsService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        long totalApplications = applicationRepository.count();
        long totalSelected = applicationRepository.countDistinctSelectedStudents();

        double placementPct = 0.0;
        if (totalStudents > 0) {
            placementPct = ((double) totalSelected * 100.0) / totalStudents;
            placementPct = BigDecimal.valueOf(placementPct).setScale(2, RoundingMode.HALF_UP).doubleValue();
        }

        BigDecimal highestPkg = applicationRepository.findHighestSelectedPackage();
        if (highestPkg == null) {
            highestPkg = BigDecimal.ZERO;
        }

        Double avgPkgVal = applicationRepository.findAverageSelectedPackage();
        double averagePkg = 0.0;
        if (avgPkgVal != null) {
            averagePkg = BigDecimal.valueOf(avgPkgVal).setScale(2, RoundingMode.HALF_UP).doubleValue();
        }

        // Compute status-wise stats
        List<StatusStat> statusStats = new ArrayList<>();
        List<Object[]> statusCounts = applicationRepository.findApplicationCountByStatus();
        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : statusCounts) {
            ApplicationStatus status = (ApplicationStatus) row[0];
            Long count = (Long) row[1];
            statusMap.put(status.name(), count);
        }
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusStats.add(new StatusStat(status.name(), statusMap.getOrDefault(status.name(), 0L)));
        }

        // Compute branch-wise stats
        List<BranchStat> branchStats = new ArrayList<>();
        List<Object[]> studentCounts = applicationRepository.findStudentCountByBranch();
        List<Object[]> placedCounts = applicationRepository.findSelectedCountByBranch();

        Map<String, Long> totalBranchMap = new HashMap<>();
        for (Object[] row : studentCounts) {
            String branch = (String) row[0];
            Long count = (Long) row[1];
            if (branch != null && !branch.trim().isEmpty()) {
                totalBranchMap.put(branch, count);
            }
        }

        Map<String, Long> placedBranchMap = new HashMap<>();
        for (Object[] row : placedCounts) {
            String branch = (String) row[0];
            Long count = (Long) row[1];
            if (branch != null && !branch.trim().isEmpty()) {
                placedBranchMap.put(branch, count);
            }
        }

        for (String branch : totalBranchMap.keySet()) {
            long total = totalBranchMap.getOrDefault(branch, 0L);
            long placed = placedBranchMap.getOrDefault(branch, 0L);
            branchStats.add(new BranchStat(branch, total, placed));
        }

        return DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalCompanies(totalCompanies)
                .totalApplications(totalApplications)
                .totalSelectedStudents(totalSelected)
                .placementPercentage(placementPct)
                .highestPackage(highestPkg)
                .averagePackage(averagePkg)
                .statusStats(statusStats)
                .branchPlacedStats(branchStats)
                .build();
    }
}
