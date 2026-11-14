package com.teamsync.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Project lead name is required")
    private String leadName;

    private String leadAvatar;

    private String status;

    private String priority;

    private Integer progress;

    private String budget;

    private String startDate;

    private String deadline;
}

