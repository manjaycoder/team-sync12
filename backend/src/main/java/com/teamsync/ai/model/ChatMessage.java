package com.teamsync.ai.model;

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
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_messages")
@CompoundIndexes({
    @CompoundIndex(name = "conv_created_idx", def = "{'conversationId': 1, 'createdAt': 1}")
})
public class ChatMessage {

    @Id
    private String id;

    @Indexed
    private String conversationId;

    private String sender; // "user", "assistant", "system"

    private String content;

    @Builder.Default
    private List<String> toolsExecuted = new ArrayList<>();

    @CreatedDate
    @Builder.Default
    private Instant createdAt = Instant.now();
}

