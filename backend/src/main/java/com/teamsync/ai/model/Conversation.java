package com.teamsync.ai.model;

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
@Document(collection = "conversations")
@CompoundIndexes({
    @CompoundIndex(name = "company_user_conv_idx", def = "{'companyId': 1, 'userId': 1}")
})
public class Conversation extends AuditableEntity {

    @Id
    private String id;

    @Indexed
    private String companyId;

    @Indexed
    private String userId;

    @Builder.Default
    private String title = "AI Intelligence Chat";
}

