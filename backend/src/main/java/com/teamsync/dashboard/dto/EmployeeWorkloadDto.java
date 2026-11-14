package com.teamsync.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeWorkloadDto {

    private String employeeId;
    private String name;
    private String email;
    private String role;
    private String department;
    private String avatar;
    private long totalAssignedTasks;
    private long completedTasks;
    private long activeTasks;
    private int workloadPercentage;
}
