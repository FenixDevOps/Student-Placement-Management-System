package com.placement.system.controller;

import com.placement.system.dto.DashboardStatsDto;
import com.placement.system.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@Tag(name = "Placement Statistics Module", description = "Endpoints for retrieving general and branch-wise placement drive stats.")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Get aggregated placement stats", description = "Computes total candidates, corporate counts, application rates, CTC ranges, and branch lists.")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = statsService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
