package com.teamsync.task.repository;

import com.teamsync.task.model.TaskActivity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskActivityRepository extends MongoRepository<TaskActivity, String> {

    List<TaskActivity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<TaskActivity> findAllByCompanyIdOrderByCreatedAtDesc(String companyId, Pageable pageable);
}

