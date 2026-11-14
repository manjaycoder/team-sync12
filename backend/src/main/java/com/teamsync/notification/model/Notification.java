package com.teamsync.notification.model;

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
@Document(collection = "notifications")
@CompoundIndexes({
    @CompoundIndex(name = "company_user_read_idx", def = "{'companyId': 1, 'userEmail': 1, 'read': 1}")
})
public class Notification extends AuditableEntity {

    @Id
    private String id;

    @Indexed
    private String companyId;

    @Indexed
    private String userEmail;

    private String title;

    private String message;

    @Builder.Default
    private String type = "TASK_ALERT"; // TASK_ASSIGNED, TASK_COMPLETED, DEADLINE_ALERT, SYSTEM

    @Builder.Default
    private boolean read = false;

    private String link;
}

