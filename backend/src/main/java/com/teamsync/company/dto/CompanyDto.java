package com.teamsync.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {
    private String id;
    private String name;
    private String slug;
    private String description;
    private String ownerId;
    private String plan;
    private String logo;
    private boolean active;
    private Instant createdAt;
}

