package com.teamsync.task.repository;

import com.teamsync.task.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {

    List<Task> findAllByCompanyId(String companyId);

    List<Task> findByAssigneeEmailIgnoreCase(String assigneeEmail);

    List<Task> findByCompanyIdAndAssigneeEmailIgnoreCase(String companyId, String assigneeEmail);

    List<Task> findByProjectId(String projectId);

    List<Task> findByProjectNameIgnoreCase(String projectName);

    List<Task> findByStatusIgnoreCase(String status);

    List<Task> findByCompanyIdAndStatusIgnoreCase(String companyId, String status);

    long countByProjectId(String projectId);

    long countByProjectNameIgnoreCase(String projectName);

    long countByProjectIdAndStatusIgnoreCase(String projectId, String status);

    long countByProjectNameIgnoreCaseAndStatusIgnoreCase(String projectName, String status);

    long countByStatusIgnoreCase(String status);

    long countByCompanyIdAndStatusIgnoreCase(String companyId, String status);

    long countByCompletedByAI(boolean completedByAI);
}

