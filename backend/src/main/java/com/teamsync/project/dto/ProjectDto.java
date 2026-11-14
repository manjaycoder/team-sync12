package com.teamsync.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private String id;
    private String companyId;
    private String name;
    private String description;
    private String department;
    private String leadName;
    private String leadAvatar;
    private String status;
    private String priority;
    private int progress;
    private String budget;
    private String startDate;
    private String deadline;
    private Instant createdAt;
    private Instant updatedAt;
}

