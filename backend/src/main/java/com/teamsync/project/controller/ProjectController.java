package com.teamsync.project.controller;

import com.teamsync.project.dto.CreateProjectRequest;
import com.teamsync.project.dto.ProjectDto;
import com.teamsync.project.service.ProjectService;
import com.teamsync.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Endpoints for project tracking, budgeting, and progress synchronization")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Get all organizational projects")
    public ResponseEntity<List<ProjectDto>> getProjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(projectService.getProjects(companyId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single project by ID")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ProjectDto> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return new ResponseEntity<>(projectService.createProject(request, companyId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project status, progress, or details")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable String id,
            @RequestBody CreateProjectRequest request) {

        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project")
    public ResponseEntity<Map<String, String>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }
}
