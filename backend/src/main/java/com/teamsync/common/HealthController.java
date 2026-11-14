package com.teamsync.common;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Liveness and readiness health probe")
public class HealthController {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @GetMapping
    @Operation(summary = "Check backend engine health status")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "service", "Team-Sync Enterprise Spring Boot 3 Engine",
                "version", "1.0.0",
                "architecture", "MODULAR_MONOLITH",
                "database", "MongoDB",
                "mode", activeProfile,
                "timestamp", Instant.now().toString()
        ));
    }
}
