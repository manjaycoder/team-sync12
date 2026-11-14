package com.teamsync.task.model;

import com.teamsync.common.AuditableEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "tasks")
@CompoundIndexes({
    @CompoundIndex(name = "company_task_status_idx", def = "{'companyId': 1, 'status': 1}"),
    @CompoundIndex(name = "company_assignee_idx", def = "{'companyId': 1, 'assigneeEmail': 1}")
})
public class Task extends AuditableEntity {

    @Id
    private String id;

    @Indexed
    private String companyId;

    private String title;

    @Builder.Default
    private String description = "";

    private String projectId;

    private String projectName;

    private String department;

    private String assigneeId;

    private String assigneeName;

    @Builder.Default
    private String assigneeAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    @Indexed
    private String assigneeEmail;

    @Builder.Default
    private String status = "todo"; // todo, in_progress, review, completed, blocked, overdue

    @Builder.Default
    private String priority = "medium"; // low, medium, high, urgent

    private String dueDate;

    @Builder.Default
    private int estimatedHours = 8;

    @Builder.Default
    private String createdBy = "Admin";

    @Builder.Default
    private boolean completedByAI = false;

    @Builder.Default
    private String aiCompletionSummary = "";

    private String completedAt;
}

