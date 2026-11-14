package com.teamsync.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private String id;
    private String companyId;
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
    private int estimatedHours;
    private String createdBy;
    private boolean completedByAI;
    private String aiCompletionSummary;
    private String completedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
