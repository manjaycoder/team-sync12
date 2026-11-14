package com.teamsync.dashboard.service;

import com.teamsync.dashboard.dto.DashboardStatsResponse;
import com.teamsync.dashboard.dto.EmployeeWorkloadDto;
import com.teamsync.department.repository.DepartmentRepository;
import com.teamsync.employee.model.User;
import com.teamsync.employee.repository.UserRepository;
import com.teamsync.project.repository.ProjectRepository;
import com.teamsync.task.model.Task;
import com.teamsync.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final MongoTemplate mongoTemplate;

    public DashboardStatsResponse getDashboardStats(String companyId) {
        long totalEmployees = StringUtils.hasText(companyId)
                ? userRepository.countByCompanyId(companyId)
                : userRepository.count();

        long totalDepartments = StringUtils.hasText(companyId)
                ? departmentRepository.findAllByCompanyId(companyId).size()
                : departmentRepository.count();

        long totalProjects = StringUtils.hasText(companyId)
                ? projectRepository.findAllByCompanyId(companyId).size()
                : projectRepository.count();

        List<Task> tasks = StringUtils.hasText(companyId)
                ? taskRepository.findAllByCompanyId(companyId)
                : taskRepository.findAll();

        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> "completed".equalsIgnoreCase(t.getStatus())).count();
        long inProgressTasks = tasks.stream().filter(t -> "in_progress".equalsIgnoreCase(t.getStatus())).count();
        long pendingTasks = tasks.stream().filter(t -> "todo".equalsIgnoreCase(t.getStatus()) || "pending".equalsIgnoreCase(t.getStatus())).count();
        long overdueTasks = tasks.stream().filter(t -> "overdue".equalsIgnoreCase(t.getStatus()) || "blocked".equalsIgnoreCase(t.getStatus())).count();
        long aiCompletedTasks = tasks.stream().filter(Task::isCompletedByAI).count();

        double completionRate = totalTasks > 0 ? ((double) completedTasks / totalTasks) * 100.0 : 0.0;
        double velocityScore = 96.0; // Standard velocity metric

        // Aggregation for status breakdown
        Map<String, Long> tasksByStatus = new HashMap<>();
        tasksByStatus.put("todo", pendingTasks);
        tasksByStatus.put("in_progress", inProgressTasks);
        tasksByStatus.put("completed", completedTasks);
        tasksByStatus.put("overdue", overdueTasks);

        // Aggregation for priority breakdown
        Map<String, Long> tasksByPriority = tasks.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getPriority() != null ? t.getPriority().toLowerCase() : "medium",
                        Collectors.counting()
                ));

        return DashboardStatsResponse.builder()
                .totalEmployees(totalEmployees)
                .totalDepartments(totalDepartments)
                .totalProjects(totalProjects)
                .totalTasks(totalTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .completedTasks(completedTasks)
                .overdueTasks(overdueTasks)
                .aiCompletedTasks(aiCompletedTasks)
                .completionRate(Math.round(completionRate * 10.0) / 10.0)
                .velocityScore(velocityScore)
                .tasksByStatus(tasksByStatus)
                .tasksByPriority(tasksByPriority)
                .build();
    }

    /**
     * Compute Employee Workload using MongoDB Aggregation Pipeline
     */
    public List<EmployeeWorkloadDto> getEmployeeWorkload(String companyId) {
        List<User> employees = StringUtils.hasText(companyId)
                ? userRepository.findAllByCompanyId(companyId)
                : userRepository.findAll();

        // 1. MongoDB Aggregation: group total tasks by assigneeEmail
        List<org.springframework.data.mongodb.core.aggregation.AggregationOperation> totalOps = new ArrayList<>();
        if (StringUtils.hasText(companyId)) {
            totalOps.add(match(Criteria.where("companyId").is(companyId)));
        }
        totalOps.add(group("assigneeEmail").count().as("totalTasks"));

        Aggregation totalAgg = newAggregation(totalOps);
        AggregationResults<Document> totalResults = mongoTemplate.aggregate(totalAgg, "tasks", Document.class);

        Map<String, Long> totalTasksByEmail = new HashMap<>();
        for (Document doc : totalResults.getMappedResults()) {
            String email = doc.getString("_id");
            if (email != null) {
                totalTasksByEmail.put(email.toLowerCase(), ((Number) doc.getOrDefault("totalTasks", 0)).longValue());
            }
        }

        // 2. MongoDB Aggregation: group completed tasks by assigneeEmail
        List<org.springframework.data.mongodb.core.aggregation.AggregationOperation> compOps = new ArrayList<>();
        if (StringUtils.hasText(companyId)) {
            compOps.add(match(Criteria.where("companyId").is(companyId).and("status").is("completed")));
        } else {
            compOps.add(match(Criteria.where("status").is("completed")));
        }
        compOps.add(group("assigneeEmail").count().as("completedTasks"));

        Aggregation compAgg = newAggregation(compOps);
        AggregationResults<Document> compResults = mongoTemplate.aggregate(compAgg, "tasks", Document.class);

        Map<String, Long> completedTasksByEmail = new HashMap<>();
        for (Document doc : compResults.getMappedResults()) {
            String email = doc.getString("_id");
            if (email != null) {
                completedTasksByEmail.put(email.toLowerCase(), ((Number) doc.getOrDefault("completedTasks", 0)).longValue());
            }
        }

        List<EmployeeWorkloadDto> list = new ArrayList<>();
        for (User u : employees) {
            String email = u.getEmail() != null ? u.getEmail().toLowerCase() : "";
            long total = totalTasksByEmail.getOrDefault(email, 0L);
            long completed = completedTasksByEmail.getOrDefault(email, 0L);
            long active = Math.max(0, total - completed);

            // Workload index: 1 active task = ~25% capacity
            int workloadPercentage = Math.min(100, (int) (active * 25));

            list.add(EmployeeWorkloadDto.builder()
                    .employeeId(u.getId())
                    .name(u.getName())
                    .email(u.getEmail())
                    .role(u.getRole())
                    .department(u.getDepartment())
                    .avatar(u.getAvatar())
                    .totalAssignedTasks(total)
                    .completedTasks(completed)
                    .activeTasks(active)
                    .workloadPercentage(workloadPercentage)
                    .build());
        }

        return list;
    }
}
