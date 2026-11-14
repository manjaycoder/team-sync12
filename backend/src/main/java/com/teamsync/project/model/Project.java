package com.teamsync.project.model;

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
@Document(collection = "projects")
@CompoundIndexes({
    @CompoundIndex(name = "company_project_status_idx", def = "{'companyId': 1, 'status': 1}")
})
public class Project extends AuditableEntity {

    @Id
    private String id;

    @Indexed
    private String companyId;

    private String name;

    @Builder.Default
    private String description = "Cross-functional enterprise project.";

    private String department;

    private String leadName;

    @Builder.Default
    private String leadAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    @Builder.Default
    private String status = "active"; // planning, active, in_progress, completed, on_hold

    @Builder.Default
    private String priority = "medium"; // low, medium, high, urgent

    @Builder.Default
    private int progress = 0;

    @Builder.Default
    private String budget = "$100,000";

    @Builder.Default
    private String startDate = "Nov 1, 2026";

    @Builder.Default
    private String deadline = "Q4 2026";
}

