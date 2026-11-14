package com.teamsync.department.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDto {
    private String id;
    private String companyId;
    private String name;
    private String description;
    private String leadName;
    private String leadAvatar;
    private int memberCount;
    private int activeProjects;
    private String budget;
    private String color;
    private Instant createdAt;
    private Instant updatedAt;
}

