package com.teamsync.department.model;

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
@Document(collection = "departments")
@CompoundIndexes({
    @CompoundIndex(name = "company_dept_name_idx", def = "{'companyId': 1, 'name': 1}")
})
public class Department extends AuditableEntity {

    @Id
    private String id;

    @Indexed
    private String companyId;

    private String name;

    @Builder.Default
    private String description = "Cross-functional department focused on key organizational objectives.";

    private String leadName;

    @Builder.Default
    private String leadAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    @Builder.Default
    private int memberCount = 1;

    @Builder.Default
    private int activeProjects = 1;

    @Builder.Default
    private String budget = "$250,000";

    @Builder.Default
    private String color = "from-violet-600 to-indigo-600";
}

