package com.teamsync.project.service;

import com.teamsync.exception.ResourceNotFoundException;
import com.teamsync.project.dto.CreateProjectRequest;
import com.teamsync.project.dto.ProjectDto;
import com.teamsync.project.model.Project;
import com.teamsync.project.repository.ProjectRepository;
import com.teamsync.task.model.TaskActivity;
import com.teamsync.task.repository.TaskActivityRepository;
import com.teamsync.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskActivityRepository taskActivityRepository;
    private final TaskRepository taskRepository;

    public List<ProjectDto> getProjects(String companyId) {
        List<Project> list;
        if (StringUtils.hasText(companyId)) {
            list = projectRepository.findAllByCompanyId(companyId);
        } else {
            list = projectRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProjectDto getProjectById(String id) {
        Project proj = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return toDto(proj);
    }

    public ProjectDto createProject(CreateProjectRequest request, String companyId) {
        String leadAvatar = StringUtils.hasText(request.getLeadAvatar())
                ? request.getLeadAvatar()
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

        Project project = Project.builder()
                .name(request.getName().trim())
                .description(StringUtils.hasText(request.getDescription()) ? request.getDescription().trim() : "Cross-functional enterprise project.")
                .department(request.getDepartment().trim())
                .leadName(request.getLeadName().trim())
                .leadAvatar(leadAvatar)
                .status(StringUtils.hasText(request.getStatus()) ? request.getStatus().trim() : "active")
                .priority(StringUtils.hasText(request.getPriority()) ? request.getPriority().trim() : "medium")
                .progress(request.getProgress() != null ? request.getProgress() : 0)
                .budget(StringUtils.hasText(request.getBudget()) ? request.getBudget() : "$100,000")
                .startDate(StringUtils.hasText(request.getStartDate()) ? request.getStartDate() : "Nov 1, 2026")
                .deadline(StringUtils.hasText(request.getDeadline()) ? request.getDeadline() : "Q4 2026")
                .companyId(companyId)
                .build();

        Project saved = projectRepository.save(project);

        // Record Activity
        taskActivityRepository.save(TaskActivity.builder()
                .companyId(companyId)
                .user(saved.getLeadName())
                .avatar(saved.getLeadAvatar())
                .action("initiated strategic project")
                .target(saved.getName())
                .createdAt(Instant.now())
                .build());

        return toDto(saved);
    }

    public ProjectDto updateProject(String id, CreateProjectRequest request) {
        Project proj = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (StringUtils.hasText(request.getName())) proj.setName(request.getName().trim());
        if (StringUtils.hasText(request.getDescription())) proj.setDescription(request.getDescription().trim());
        if (StringUtils.hasText(request.getDepartment())) proj.setDepartment(request.getDepartment().trim());
        if (StringUtils.hasText(request.getLeadName())) proj.setLeadName(request.getLeadName().trim());
        if (StringUtils.hasText(request.getLeadAvatar())) proj.setLeadAvatar(request.getLeadAvatar().trim());
        if (StringUtils.hasText(request.getStatus())) proj.setStatus(request.getStatus().trim());
        if (StringUtils.hasText(request.getPriority())) proj.setPriority(request.getPriority().trim());
        if (request.getProgress() != null) proj.setProgress(request.getProgress());
        if (StringUtils.hasText(request.getBudget())) proj.setBudget(request.getBudget().trim());
        if (StringUtils.hasText(request.getDeadline())) proj.setDeadline(request.getDeadline().trim());

        return toDto(projectRepository.save(proj));
    }

    public void deleteProject(String id) {
        Project proj = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.delete(proj);
    }

    public void syncProjectProgress(String projectName, String projectId) {
        try {
            long totalTasks = StringUtils.hasText(projectId)
                    ? taskRepository.countByProjectId(projectId)
                    : taskRepository.countByProjectNameIgnoreCase(projectName);

            if (totalTasks == 0) return;

            long completedTasks = StringUtils.hasText(projectId)
                    ? taskRepository.countByProjectIdAndStatusIgnoreCase(projectId, "completed")
                    : taskRepository.countByProjectNameIgnoreCaseAndStatusIgnoreCase(projectName, "completed");

            int progress = (int) Math.round(((double) completedTasks / totalTasks) * 100);
            String status = progress == 100 ? "completed" : progress > 0 ? "in_progress" : "active";

            if (StringUtils.hasText(projectId)) {
                projectRepository.findById(projectId).ifPresent(p -> {
                    p.setProgress(progress);
                    p.setStatus(status);
                    projectRepository.save(p);
                });
            } else if (StringUtils.hasText(projectName)) {
                projectRepository.findByNameIgnoreCase(projectName).ifPresent(p -> {
                    p.setProgress(progress);
                    p.setStatus(status);
                    projectRepository.save(p);
                });
            }
        } catch (Exception ex) {
            log.warn("Non-fatal error synchronizing project progress: {}", ex.getMessage());
        }
    }

    public ProjectDto toDto(Project p) {
        return ProjectDto.builder()
                .id(p.getId())
                .companyId(p.getCompanyId())
                .name(p.getName())
                .description(p.getDescription())
                .department(p.getDepartment())
                .leadName(p.getLeadName())
                .leadAvatar(p.getLeadAvatar())
                .status(p.getStatus())
                .priority(p.getPriority())
                .progress(p.getProgress())
                .budget(p.getBudget())
                .startDate(p.getStartDate())
                .deadline(p.getDeadline())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}

