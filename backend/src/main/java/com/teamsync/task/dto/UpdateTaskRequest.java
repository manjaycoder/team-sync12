package com.teamsync.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {

    private String title;
    private String description;
    private String projectId;
    private String projectName;
    private String department;
    private String assigneeId;
    private String assigneeName;
    private String assigneeAvatar;
    private String assigneeEmail;
    private String status;
    private String priority;
    private String dueDate;
    private Integer estimatedHours;
    private Boolean useAI;
    private Boolean completedByAI;
    private String aiCompletionSummary;
    private String completedAt;
}
