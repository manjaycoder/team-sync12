package com.teamsync.company.controller;

import com.teamsync.company.dto.CompanyDto;
import com.teamsync.company.dto.CreateCompanyRequest;
import com.teamsync.company.service.CompanyService;
import com.teamsync.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Company", description = "Endpoints for managing enterprise companies and multi-tenant isolation")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    @Operation(summary = "Get all registered companies")
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get company details by ID")
    public ResponseEntity<CompanyDto> getCompanyById(@PathVariable String id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new company")
    public ResponseEntity<CompanyDto> createCompany(@Valid @RequestBody CreateCompanyRequest request,
                                                    @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String ownerId = userPrincipal != null ? userPrincipal.getId() : null;
        return new ResponseEntity<>(companyService.createCompany(request, ownerId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update company settings")
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable String id,
                                                    @Valid @RequestBody CreateCompanyRequest request) {
        return ResponseEntity.ok(companyService.updateCompany(id, request));
    }
}

