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
public class SyncBriefingResponse {

    private String headline;
    private int velocityScore;
    private String executiveSummary;
    private List<DepartmentInsight> departmentInsights;
    private List<String> keyRecommendations;
    private String generatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentInsight {
        private String department;
        private String health; // OPTIMAL, MODERATE, NEEDS_ATTENTION
        private String focus;
    }
}
