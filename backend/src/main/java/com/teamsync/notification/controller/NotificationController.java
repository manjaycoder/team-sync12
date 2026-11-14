package com.teamsync.notification.controller;

import com.teamsync.notification.dto.NotificationDto;
import com.teamsync.notification.service.NotificationService;
import com.teamsync.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Endpoints for employee alerts and task assignment notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get current employee notifications")
    public ResponseEntity<List<NotificationDto>> getNotifications(
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(notificationService.getUserNotifications(
                userPrincipal.getEmail(), userPrincipal.getCompanyId(), limit));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(Map.of("unreadCount", 0L));
        }
        long count = notificationService.getUnreadCount(userPrincipal.getEmail(), userPrincipal.getCompanyId());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark single notification as read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Map<String, String>> markAllAsRead(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal != null) {
            notificationService.markAllAsRead(userPrincipal.getEmail(), userPrincipal.getCompanyId());
        }
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
