package com.teamsync.notification.service;

import com.teamsync.exception.ResourceNotFoundException;
import com.teamsync.notification.dto.NotificationDto;
import com.teamsync.notification.model.Notification;
import com.teamsync.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationDto> getUserNotifications(String userEmail, String companyId, int limit) {
        Pageable pageable = PageRequest.of(0, limit > 0 ? limit : 20);
        List<Notification> list;

        if (StringUtils.hasText(companyId)) {
            list = notificationRepository.findByCompanyIdAndUserEmailIgnoreCaseOrderByCreatedAtDesc(companyId, userEmail, pageable);
        } else {
            list = notificationRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(userEmail, pageable);
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public long getUnreadCount(String userEmail, String companyId) {
        if (StringUtils.hasText(companyId)) {
            return notificationRepository.countByCompanyIdAndUserEmailIgnoreCaseAndReadFalse(companyId, userEmail);
        }
        return notificationRepository.countByUserEmailIgnoreCaseAndReadFalse(userEmail);
    }

    public void markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(String userEmail, String companyId) {
        Pageable pageable = PageRequest.of(0, 100);
        List<Notification> unreadList;
        if (StringUtils.hasText(companyId)) {
            unreadList = notificationRepository.findByCompanyIdAndUserEmailIgnoreCaseOrderByCreatedAtDesc(companyId, userEmail, pageable);
        } else {
            unreadList = notificationRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(userEmail, pageable);
        }

        unreadList.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadList);
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .companyId(n.getCompanyId())
                .userEmail(n.getUserEmail())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.isRead())
                .link(n.getLink())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
