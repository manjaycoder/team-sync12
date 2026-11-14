package com.teamsync.task.controller;

import com.teamsync.security.UserPrincipal;
import com.teamsync.task.dto.CreateTaskRequest;
import com.teamsync.task.dto.TaskDto;
import com.teamsync.task.dto.UpdateTaskRequest;
import com.teamsync.task.service.TaskService;
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
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Endpoints for task allocation, Kanban lifecycle tracking, and Gemini AI completion")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks with filtering by assignee, project, status, and department")
    public ResponseEntity<List<TaskDto>> getTasks(
            @RequestParam(required = false) String assigneeEmail,
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(taskService.getTasks(assigneeEmail, projectId, status, department, companyId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single task details by ID")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    @Operation(summary = "Allocate / create new task")
    public ResponseEntity<TaskDto> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return new ResponseEntity<>(taskService.createTask(request, companyId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task status, priority, or details")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable String id,
            @RequestBody UpdateTaskRequest request) {

        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }

    @PostMapping("/{id}/ai-complete")
    @Operation(summary = "Execute task completion using Gemini AI")
    public ResponseEntity<TaskDto> aiCompleteTask(@PathVariable String id) {
        return ResponseEntity.ok(taskService.aiCompleteTask(id));
    }
}
