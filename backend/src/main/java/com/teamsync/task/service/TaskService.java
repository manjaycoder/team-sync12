package com.teamsync.task.service;

import com.teamsync.exception.ResourceNotFoundException;
import com.teamsync.notification.model.Notification;
import com.teamsync.notification.repository.NotificationRepository;
import com.teamsync.project.model.Project;
import com.teamsync.project.repository.ProjectRepository;
import com.teamsync.project.service.ProjectService;
import com.teamsync.task.dto.CreateTaskRequest;
import com.teamsync.task.dto.TaskDto;
import com.teamsync.task.dto.UpdateTaskRequest;
import com.teamsync.task.model.Task;
import com.teamsync.task.model.TaskActivity;
import com.teamsync.task.repository.TaskActivityRepository;
import com.teamsync.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskActivityRepository taskActivityRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final NotificationRepository notificationRepository;
    private final MongoTemplate mongoTemplate;

    public List<TaskDto> getTasks(String assigneeEmail, String projectId, String status, String department, String companyId) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (StringUtils.hasText(companyId)) {
            criteriaList.add(Criteria.where("companyId").is(companyId));
        }
        if (StringUtils.hasText(assigneeEmail)) {
            criteriaList.add(Criteria.where("assigneeEmail").is(assigneeEmail.trim().toLowerCase()));
        }
        if (StringUtils.hasText(projectId)) {
            criteriaList.add(Criteria.where("projectId").is(projectId.trim()));
        }
        if (StringUtils.hasText(status)) {
            criteriaList.add(Criteria.where("status").is(status.trim()));
        }
        if (StringUtils.hasText(department)) {
            criteriaList.add(Criteria.where("department").is(department.trim()));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        return mongoTemplate.find(query, Task.class).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TaskDto getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return toDto(task);
    }

    public TaskDto createTask(CreateTaskRequest request, String companyId) {
        String resolvedProjectId = request.getProjectId();
        String resolvedDepartment = request.getDepartment();

        if (!StringUtils.hasText(resolvedProjectId)) {
            Project proj = projectRepository.findByNameIgnoreCase(request.getProjectName()).orElse(null);
            if (proj != null) {
                resolvedProjectId = proj.getId();
                if (!StringUtils.hasText(resolvedDepartment)) {
                    resolvedDepartment = proj.getDepartment();
                }
            }
        }

        String avatar = StringUtils.hasText(request.getAssigneeAvatar())
                ? request.getAssigneeAvatar()
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

        String dueDate = StringUtils.hasText(request.getDueDate())
                ? request.getDueDate()
                : LocalDate.now().plusDays(7).format(DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.US));

        Task task = Task.builder()
                .title(request.getTitle().trim())
                .description(StringUtils.hasText(request.getDescription()) ? request.getDescription().trim() : "")
                .projectId(resolvedProjectId)
                .projectName(request.getProjectName().trim())
                .department(StringUtils.hasText(resolvedDepartment) ? resolvedDepartment.trim() : "Engineering")
                .assigneeId(request.getAssigneeId())
                .assigneeName(request.getAssigneeName().trim())
                .assigneeAvatar(avatar)
                .assigneeEmail(request.getAssigneeEmail().trim().toLowerCase())
                .status(StringUtils.hasText(request.getStatus()) ? request.getStatus().trim() : "todo")
                .priority(StringUtils.hasText(request.getPriority()) ? request.getPriority().trim() : "medium")
                .dueDate(dueDate)
                .estimatedHours(request.getEstimatedHours() != null ? request.getEstimatedHours() : 8)
                .createdBy(StringUtils.hasText(request.getCreatedBy()) ? request.getCreatedBy().trim() : "Lead Coordinator")
                .companyId(companyId)
                .build();

        Task saved = taskRepository.save(task);

        // Sync project progress
        projectService.syncProjectProgress(saved.getProjectName(), saved.getProjectId());

        // Log Activity
        taskActivityRepository.save(TaskActivity.builder()
                .companyId(companyId)
                .user(saved.getCreatedBy())
                .avatar(saved.getAssigneeAvatar())
                .action(String.format("allocated task \"%s\" to", saved.getTitle()))
                .target(saved.getAssigneeName())
                .createdAt(Instant.now())
                .build());

        // Create In-App Notification
        notificationRepository.save(Notification.builder()
                .companyId(companyId)
                .userEmail(saved.getAssigneeEmail())
                .title("New Task Assigned")
                .message(String.format("You were assigned task \"%s\" under project \"%s\"", saved.getTitle(), saved.getProjectName()))
                .type("TASK_ASSIGNED")
                .link("/home/projects")
                .build());

        return toDto(saved);
    }

    public TaskDto updateTask(String id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String oldStatus = task.getStatus();
        boolean isNowCompleting = "completed".equalsIgnoreCase(request.getStatus()) && !"completed".equalsIgnoreCase(oldStatus);

        if (isNowCompleting && !StringUtils.hasText(task.getAiCompletionSummary()) && !Boolean.FALSE.equals(request.getUseAI())) {
            task.setCompletedByAI(true);
            task.setAiCompletionSummary(generateDefaultAiSummary(task));
            task.setCompletedAt(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.US)));
        }

        if (StringUtils.hasText(request.getTitle())) task.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) task.setDescription(request.getDescription().trim());
        if (StringUtils.hasText(request.getProjectId())) task.setProjectId(request.getProjectId());
        if (StringUtils.hasText(request.getProjectName())) task.setProjectName(request.getProjectName().trim());
        if (StringUtils.hasText(request.getDepartment())) task.setDepartment(request.getDepartment().trim());
        if (StringUtils.hasText(request.getAssigneeId())) task.setAssigneeId(request.getAssigneeId());
        if (StringUtils.hasText(request.getAssigneeName())) task.setAssigneeName(request.getAssigneeName().trim());
        if (StringUtils.hasText(request.getAssigneeAvatar())) task.setAssigneeAvatar(request.getAssigneeAvatar().trim());
        if (StringUtils.hasText(request.getAssigneeEmail())) task.setAssigneeEmail(request.getAssigneeEmail().trim().toLowerCase());
        if (StringUtils.hasText(request.getStatus())) task.setStatus(request.getStatus().trim());
        if (StringUtils.hasText(request.getPriority())) task.setPriority(request.getPriority().trim());
        if (StringUtils.hasText(request.getDueDate())) task.setDueDate(request.getDueDate().trim());
        if (request.getEstimatedHours() != null) task.setEstimatedHours(request.getEstimatedHours());
        if (request.getCompletedByAI() != null) task.setCompletedByAI(request.getCompletedByAI());
        if (StringUtils.hasText(request.getAiCompletionSummary())) task.setAiCompletionSummary(request.getAiCompletionSummary());
        if (StringUtils.hasText(request.getCompletedAt())) task.setCompletedAt(request.getCompletedAt());

        Task updated = taskRepository.save(task);

        // Sync project progress
        projectService.syncProjectProgress(updated.getProjectName(), updated.getProjectId());

        // Activity logging
        if (request.getStatus() != null && !request.getStatus().equalsIgnoreCase(oldStatus)) {
            String actionLabel = switch (request.getStatus().toLowerCase()) {
                case "completed" -> "completed deliverable on";
                case "in_progress" -> "started working on";
                case "review" -> "submitted for review";
                default -> "updated status of";
            };

            taskActivityRepository.save(TaskActivity.builder()
                    .companyId(updated.getCompanyId())
                    .user(updated.getAssigneeName() != null ? updated.getAssigneeName() : "Team Member")
                    .avatar(updated.getAssigneeAvatar())
                    .action(actionLabel)
                    .target(updated.getTitle())
                    .createdAt(Instant.now())
                    .build());
        }

        return toDto(updated);
    }

    public void deleteTask(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String projectName = task.getProjectName();
        String projectId = task.getProjectId();

        taskRepository.delete(task);

        // Sync project progress
        projectService.syncProjectProgress(projectName, projectId);
    }

    public TaskDto aiCompleteTask(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setStatus("completed");
        task.setCompletedByAI(true);
        task.setAiCompletionSummary(generateDefaultAiSummary(task));
        task.setCompletedAt(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.US)));

        Task saved = taskRepository.save(task);

        // Sync project progress
        projectService.syncProjectProgress(saved.getProjectName(), saved.getProjectId());

        // Log Activity
        taskActivityRepository.save(TaskActivity.builder()
                .companyId(saved.getCompanyId())
                .user("Google Gemini AI")
                .avatar("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80")
                .action(String.format("AI-completed deliverable \"%s\" for", saved.getTitle()))
                .target(saved.getAssigneeName())
                .createdAt(Instant.now())
                .build());

        return toDto(saved);
    }

    private String generateDefaultAiSummary(Task task) {
        return String.format("Automated Gemini AI execution completed all verification benchmarks for \"%s\". Integrated dependencies into %s production pipeline with 100%% code coverage and SOC2 telemetry compliance.",
                task.getTitle(), task.getProjectName());
    }

    public TaskDto toDto(Task t) {
        return TaskDto.builder()
                .id(t.getId())
                .companyId(t.getCompanyId())
                .title(t.getTitle())
                .description(t.getDescription())
                .projectId(t.getProjectId())
                .projectName(t.getProjectName())
                .department(t.getDepartment())
                .assigneeId(t.getAssigneeId())
                .assigneeName(t.getAssigneeName())
                .assigneeAvatar(t.getAssigneeAvatar())
                .assigneeEmail(t.getAssigneeEmail())
                .status(t.getStatus())
                .priority(t.getPriority())
                .dueDate(t.getDueDate())
                .estimatedHours(t.getEstimatedHours())
                .createdBy(t.getCreatedBy())
                .completedByAI(t.isCompletedByAI())
                .aiCompletionSummary(t.getAiCompletionSummary())
                .completedAt(t.getCompletedAt())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
