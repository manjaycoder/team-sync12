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
public class StandupResponse {

    private String department;
    private String lead;
    private String date;
    private List<String> agenda;
    private List<String> blockers;
    private List<String> actionItems;
    private String generatedAt;
}
