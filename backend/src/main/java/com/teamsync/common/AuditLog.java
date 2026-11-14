package com.teamsync.common;

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
@Document(collection = "audit_logs")
@CompoundIndexes({
    @CompoundIndex(name = "company_audit_created_idx", def = "{'companyId': 1, 'createdAt': -1}")
})
public class AuditLog {

    @Id
    private String id;

    @Indexed
    private String companyId;

    private String actor;

    private String action;

    private String resource;

    private String resourceId;

    private String details;

    private String ipAddress;

    @CreatedDate
    @Builder.Default
    private Instant createdAt = Instant.now();
}

