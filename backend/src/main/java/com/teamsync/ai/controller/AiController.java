package com.teamsync.ai.controller;

import com.teamsync.ai.dto.AiAssistantRequest;
import com.teamsync.ai.dto.AiAssistantResponse;
import com.teamsync.ai.dto.StandupResponse;
import com.teamsync.ai.dto.SyncBriefingResponse;
import com.teamsync.ai.service.AiService;
import com.teamsync.security.UserPrincipal;
import com.teamsync.task.model.TaskActivity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Intelligence", description = "Endpoints for AI assistant queries, sync briefings, standup agendas, and activity streams")
public class AiController {

    private final AiService aiService;

    @PostMapping("/assistant")
    @Operation(summary = "Ask question to the AI assistant with controlled tool calling")
    public ResponseEntity<AiAssistantResponse> askAssistant(
            @Valid @RequestBody AiAssistantRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(aiService.askAssistant(request, userId, companyId));
    }

    @PostMapping("/sync-briefing")
    @Operation(summary = "Generate organizational synchronization briefing")
    public ResponseEntity<SyncBriefingResponse> getSyncBriefing(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(aiService.getSyncBriefing(companyId));
    }

    @PostMapping("/standup")
    @Operation(summary = "Generate department standup agenda")
    public ResponseEntity<StandupResponse> getStandup(
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String departmentName = body != null ? body.get("departmentName") : null;
        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(aiService.getStandup(departmentName, companyId));
    }

    @GetMapping("/activities")
    @Operation(summary = "Get live workspace activities stream")
    public ResponseEntity<List<TaskActivity>> getActivities(
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(aiService.getActivities(companyId, limit));
    }
}
