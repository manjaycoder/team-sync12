package com.teamsync.employee.controller;

import com.teamsync.employee.dto.CreateEmployeeRequest;
import com.teamsync.employee.dto.EmployeeDto;
import com.teamsync.employee.dto.UpdateEmployeeRequest;
import com.teamsync.employee.service.EmployeeService;
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
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Endpoints for employee directory, assignment, and profile management")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "List all employees with search and department filters")
    public ResponseEntity<List<EmployeeDto>> getEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return ResponseEntity.ok(employeeService.getEmployees(search, department, status, companyId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single employee profile by ID")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable String id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    @Operation(summary = "Create new employee profile")
    public ResponseEntity<EmployeeDto> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String companyId = userPrincipal != null ? userPrincipal.getCompanyId() : null;
        return new ResponseEntity<>(employeeService.createEmployee(request, companyId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update employee details")
    public ResponseEntity<EmployeeDto> updateEmployee(
            @PathVariable String id,
            @RequestBody UpdateEmployeeRequest request) {

        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Archive / delete employee profile")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Employee removed successfully"));
    }
}

