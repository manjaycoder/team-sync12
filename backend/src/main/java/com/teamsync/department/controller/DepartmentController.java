package com.teamsync.department.controller;

import com.teamsync.department.dto.CreateDepartmentRequest;
import com.teamsync.department.dto.DepartmentDto;
import com.teamsync.department.service.DepartmentService;
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
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@Tag(name = "Departments", description = "Endpoints for department hierarchy, budgets, and lead ownership")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "Get all organizational departments")
    public ResponseEntity<List<DepartmentDto>> getDepartments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(departmentService.getDepartments(companyId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single department details by ID")
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable String id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new department")
    public ResponseEntity<DepartmentDto> createDepartment(
            @Valid @RequestBody CreateDepartmentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return new ResponseEntity<>(departmentService.createDepartment(request, companyId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update department information")
    public ResponseEntity<DepartmentDto> updateDepartment(
            @PathVariable String id,
            @RequestBody CreateDepartmentRequest request) {

        return ResponseEntity.ok(departmentService.updateDepartment(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete department")
    public ResponseEntity<Map<String, String>> deleteDepartment(@PathVariable String id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(Map.of("message", "Department deleted successfully"));
    }
}

