package com.teamsync.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalEmployees;
    private long totalDepartments;
    private long totalProjects;
    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long overdueTasks;
    private long aiCompletedTasks;
    private double completionRate;
    private double velocityScore;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksByPriority;
}
