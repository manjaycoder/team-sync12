package com.teamsync.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeRequest {

    private String name;
    private String email;
    private String role;
    private String department;
    private String status;
    private String location;
    private String avatar;
}

