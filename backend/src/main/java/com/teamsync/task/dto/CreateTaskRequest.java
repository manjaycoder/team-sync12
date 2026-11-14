package com.teamsync.task.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private String projectId;

    @NotBlank(message = "Project name is required")
    private String projectName;

    private String department;

    private String assigneeId;

    @NotBlank(message = "Assignee name is required")
    private String assigneeName;

    private String assigneeAvatar;

    @NotBlank(message = "Assignee email is required")
    private String assigneeEmail;

    private String status;

    private String priority;

    private String dueDate;

    private Integer estimatedHours;

    private String createdBy;
}
