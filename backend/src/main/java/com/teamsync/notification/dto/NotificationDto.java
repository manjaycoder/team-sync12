package com.teamsync.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private String id;
    private String companyId;
    private String userEmail;
    private String title;
    private String message;
    private String type;
    private boolean read;
    private String link;
    private Instant createdAt;
}
