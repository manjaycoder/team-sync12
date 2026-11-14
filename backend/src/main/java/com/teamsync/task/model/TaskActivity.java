package com.teamsync.task.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "task_activities")
@CompoundIndexes({
    @CompoundIndex(name = "company_activity_created_idx", def = "{'companyId': 1, 'createdAt': -1}")
})
public class TaskActivity {

    @Id
    private String id;

    @Indexed
    private String companyId;

    private String user;

    @Builder.Default
    private String avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    private String action;

    private String target;

    @CreatedDate
    @Builder.Default
    private Instant createdAt = Instant.now();
}

