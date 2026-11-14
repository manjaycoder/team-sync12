package com.teamsync.employee.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "users")
@CompoundIndexes({
    @CompoundIndex(name = "company_email_idx", def = "{'companyId': 1, 'email': 1}")
})
public class User extends AuditableEntity {

    @Id
    private String id;

    @Indexed
    private String companyId;

    private String name;

    @Indexed(unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Builder.Default
    private String role = "Team Member";

    @Builder.Default
    private String department = "Engineering";

    @Builder.Default
    private String status = "active"; // active, remote, on_leave

    @Builder.Default
    private String avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    @Builder.Default
    private String location = "Remote";

    @Builder.Default
    private String joinedDate = "Nov 2026";

    @Builder.Default
    private Set<String> roles = new HashSet<>(Set.of("ROLE_EMPLOYEE"));

    @Builder.Default
    private boolean enabled = true;
}

