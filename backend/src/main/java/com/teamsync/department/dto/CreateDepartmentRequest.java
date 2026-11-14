package com.teamsync.department.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDepartmentRequest {

    @NotBlank(message = "Department name is required")
    private String name;

    private String description;

    @NotBlank(message = "Department lead name is required")
    private String leadName;

    private String leadAvatar;

    private Integer memberCount;

    private Integer activeProjects;

    private String budget;

    private String color;
}

