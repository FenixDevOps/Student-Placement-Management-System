package com.placement.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalStudents;
    private long totalCompanies;
    private long totalApplications;
    private long totalSelectedStudents;
    private double placementPercentage;
    private BigDecimal highestPackage;
    private double averagePackage;

    private List<BranchStat> branchPlacedStats;
    private List<StatusStat> statusStats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BranchStat {
        private String branch;
        private long totalStudents;
        private long placedStudents;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusStat {
        private String status;
        private long count;
    }
}
