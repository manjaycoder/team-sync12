package com.teamsync.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String id;
    private String name;
    private String email;
    private String role;
    private String department;
    private String avatar;
    private String status;
    private String location;
    private String joinedDate;
    private String token;
    private String refreshToken;
    private String companyId;
}

