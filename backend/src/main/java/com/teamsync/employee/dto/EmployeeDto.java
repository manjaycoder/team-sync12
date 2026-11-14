package com.teamsync.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private String id;
    private String companyId;
    private String name;
    private String email;
    private String role;
    private String department;
    private String status;
    private String avatar;
    private String location;
    private String joinedDate;
    private Instant createdAt;
    private Instant updatedAt;
}

