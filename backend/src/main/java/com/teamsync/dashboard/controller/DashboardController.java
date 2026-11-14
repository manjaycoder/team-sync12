package com.teamsync.dashboard.controller;

import com.teamsync.dashboard.dto.DashboardStatsResponse;
import com.teamsync.dashboard.dto.EmployeeWorkloadDto;
import com.teamsync.dashboard.service.DashboardService;
import com.teamsync.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard & Analytics", description = "Endpoints for aggregated company statistics and employee workload distribution")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get organizational overview metrics and task distributions")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(dashboardService.getDashboardStats(companyId));
    }

    @GetMapping("/workload")
    @Operation(summary = "Get employee workload distribution calculated via MongoDB Aggregation")
    public ResponseEntity<List<EmployeeWorkloadDto>> getEmployeeWorkload(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(dashboardService.getEmployeeWorkload(companyId));
    }
}
