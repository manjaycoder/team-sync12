package com.teamsync.notification.repository;

import com.teamsync.notification.model.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String userEmail, Pageable pageable);

    List<Notification> findByCompanyIdAndUserEmailIgnoreCaseOrderByCreatedAtDesc(String companyId, String userEmail, Pageable pageable);

    long countByUserEmailIgnoreCaseAndReadFalse(String userEmail);

    long countByCompanyIdAndUserEmailIgnoreCaseAndReadFalse(String companyId, String userEmail);
}

