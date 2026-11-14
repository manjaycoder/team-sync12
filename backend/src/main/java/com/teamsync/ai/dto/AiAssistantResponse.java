package com.teamsync.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAssistantResponse {

    private String question;
    private String answer;
    private String conversationId;
    private List<String> toolsUsed;
}
