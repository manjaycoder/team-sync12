package com.teamsync.ai.service;

import com.teamsync.department.model.Department;
import com.teamsync.department.repository.DepartmentRepository;
import com.teamsync.employee.model.User;
import com.teamsync.employee.repository.UserRepository;
import com.teamsync.project.model.Project;
import com.teamsync.project.repository.ProjectRepository;
import com.teamsync.task.model.Task;
import com.teamsync.task.model.TaskActivity;
import com.teamsync.task.repository.TaskActivityRepository;
import com.teamsync.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiToolExecutor {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final DepartmentRepository departmentRepository;
    private final ProjectRepository projectRepository;
    private final TaskActivityRepository taskActivityRepository;

    /**
     * Tool 1: Which employees are currently working?
     */
    public String getWorkingEmployees(String companyId) {
        List<User> users = StringUtils.hasText(companyId)
                ? userRepository.findAllByCompanyId(companyId)
                : userRepository.findAll();

        List<User> activeUsers = users.stream()
                .filter(u -> "active".equalsIgnoreCase(u.getStatus()) || "remote".equalsIgnoreCase(u.getStatus()))
                .collect(Collectors.toList());

        if (activeUsers.isEmpty()) {
            return "No employees currently marked as active or remote.";
        }

        StringBuilder sb = new StringBuilder("Currently active & working employees:\n");
        for (User u : activeUsers) {
            sb.append(String.format("• %s — %s (%s, %s, %s)\n",
                    u.getName(), u.getRole(), u.getDepartment(), u.getStatus().toUpperCase(), u.getLocation()));
        }
        return sb.toString();
    }

    /**
     * Tool 2: Show all pending tasks.
     */
    public String getPendingTasks(String companyId) {
        List<Task> tasks = StringUtils.hasText(companyId)
                ? taskRepository.findAllByCompanyId(companyId)
                : taskRepository.findAll();

        List<Task> pending = tasks.stream()
                .filter(t -> "todo".equalsIgnoreCase(t.getStatus()) || "pending".equalsIgnoreCase(t.getStatus()))
                .collect(Collectors.toList());

        if (pending.isEmpty()) {
            return "There are zero pending tasks in the backlog. All items are either in-progress or completed!";
        }

        StringBuilder sb = new StringBuilder(String.format("Found %d pending task(s):\n", pending.size()));
        for (Task t : pending) {
            sb.append(String.format("• [%s] \"%s\" in %s — Assigned to: %s (Due: %s, Priority: %s)\n",
                    t.getStatus().toUpperCase(), t.getTitle(), t.getProjectName(), t.getAssigneeName(), t.getDueDate(), t.getPriority()));
        }
        return sb.toString();
    }

    /**
     * Tool 3: Which employees have overdue tasks?
     */
    public String getEmployeesWithOverdueTasks(String companyId) {
        List<Task> tasks = StringUtils.hasText(companyId)
                ? taskRepository.findAllByCompanyId(companyId)
                : taskRepository.findAll();

        List<Task> overdue = tasks.stream()
                .filter(t -> "overdue".equalsIgnoreCase(t.getStatus()) || "blocked".equalsIgnoreCase(t.getStatus()))
                .collect(Collectors.toList());

        if (overdue.isEmpty()) {
            return "Good news! No employees currently have tasks marked as overdue or blocked.";
        }

        Map<String, List<Task>> byEmployee = overdue.stream()
                .collect(Collectors.groupingBy(Task::getAssigneeName));

        StringBuilder sb = new StringBuilder("Employees with overdue or blocked deliverables:\n");
        byEmployee.forEach((employee, taskList) -> {
            sb.append(String.format("• %s (%d task(s)):\n", employee, taskList.size()));
            for (Task t : taskList) {
                sb.append(String.format("   - \"%s\" (Due: %s, Project: %s)\n", t.getTitle(), t.getDueDate(), t.getProjectName()));
            }
        });
        return sb.toString();
    }

    /**
     * Tool 4: What tasks belong to a specific employee?
     */
    public String getEmployeeTasks(String employeeNameOrEmail, String companyId) {
        if (!StringUtils.hasText(employeeNameOrEmail)) {
            return "Please specify an employee name or email.";
        }

        List<Task> tasks = StringUtils.hasText(companyId)
                ? taskRepository.findAllByCompanyId(companyId)
                : taskRepository.findAll();

        String term = employeeNameOrEmail.trim().toLowerCase();
        List<Task> matched = tasks.stream()
                .filter(t -> (t.getAssigneeName() != null && t.getAssigneeName().toLowerCase().contains(term))
                        || (t.getAssigneeEmail() != null && t.getAssigneeEmail().toLowerCase().contains(term)))
                .collect(Collectors.toList());

        if (matched.isEmpty()) {
            return String.format("No tasks found assigned to \"%s\".", employeeNameOrEmail);
        }

        StringBuilder sb = new StringBuilder(String.format("Tasks assigned to %s (%d total):\n", employeeNameOrEmail, matched.size()));
        for (Task t : matched) {
            sb.append(String.format("• [%s] \"%s\" — Project: %s, Priority: %s, Due: %s%s\n",
                    t.getStatus().toUpperCase(), t.getTitle(), t.getProjectName(), t.getPriority(), t.getDueDate(),
                    t.isCompletedByAI() ? " (AI Completed)" : ""));
        }
        return sb.toString();
    }

    /**
     * Tool 5: Summarize today's company activities.
     */
    public String summarizeTodayActivities(String companyId) {
        List<TaskActivity> activities = StringUtils.hasText(companyId)
                ? taskActivityRepository.findAllByCompanyIdOrderByCreatedAtDesc(companyId, PageRequest.of(0, 10))
                : taskActivityRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 10));

        if (activities.isEmpty()) {
            return "No recent workspace activities recorded in the enterprise log.";
        }

        StringBuilder sb = new StringBuilder("Recent workspace activity stream:\n");
        for (TaskActivity a : activities) {
            sb.append(String.format("• %s %s \"%s\"\n", a.getUser(), a.getAction(), a.getTarget()));
        }
        return sb.toString();
    }

    /**
     * Tool 6: Which tasks are due tomorrow / soon?
     */
    public String getTasksDueSoon(String companyId) {
        List<Task> tasks = StringUtils.hasText(companyId)
                ? taskRepository.findAllByCompanyId(companyId)
                : taskRepository.findAll();

        List<Task> activeTasks = tasks.stream()
                .filter(t -> !"completed".equalsIgnoreCase(t.getStatus()))
                .collect(Collectors.toList());

        if (activeTasks.isEmpty()) {
            return "No active tasks in progress.";
        }

        StringBuilder sb = new StringBuilder("Active tasks with upcoming deadlines:\n");
        for (Task t : activeTasks.stream().limit(8).collect(Collectors.toList())) {
            sb.append(String.format("• \"%s\" — Assigned: %s, Due: %s, Project: %s\n",
                    t.getTitle(), t.getAssigneeName(), t.getDueDate(), t.getProjectName()));
        }
        return sb.toString();
    }

    /**
     * Tool 7: What is the company's task completion percentage?
     */
    public String getTaskCompletionPercentage(String companyId) {
        List<Task> tasks = StringUtils.hasText(companyId)
                ? taskRepository.findAllByCompanyId(companyId)
                : taskRepository.findAll();

        if (tasks.isEmpty()) {
            return "The company currently has 0 tasks recorded.";
        }

        long completed = tasks.stream().filter(t -> "completed".equalsIgnoreCase(t.getStatus())).count();
        long inProgress = tasks.stream().filter(t -> "in_progress".equalsIgnoreCase(t.getStatus())).count();
        long todo = tasks.stream().filter(t -> "todo".equalsIgnoreCase(t.getStatus())).count();
        long aiCompleted = tasks.stream().filter(Task::isCompletedByAI).count();

        double percentage = ((double) completed / tasks.size()) * 100.0;

        return String.format("Task Performance & Completion Metrics:\n" +
                        "• Overall Completion Rate: %.1f%%\n" +
                        "• Total Tasks: %d\n" +
                        "• Completed: %d (%d accelerated via Gemini AI)\n" +
                        "• In Progress: %d\n" +
                        "• Pending / Backlog: %d",
                percentage, tasks.size(), completed, aiCompleted, inProgress, todo);
    }

    /**
     * Tool 8: Which employees have no assigned tasks?
     */
    public String getEmployeesWithNoTasks(String companyId) {
        List<User> users = StringUtils.hasText(companyId)
                ? userRepository.findAllByCompanyId(companyId)
                : userRepository.findAll();

        List<Task> tasks = StringUtils.hasText(companyId)
                ? taskRepository.findAllByCompanyId(companyId)
                : taskRepository.findAll();

        Set<String> assignedEmails = tasks.stream()
                .map(Task::getAssigneeEmail)
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<User> unassigned = users.stream()
                .filter(u -> !assignedEmails.contains(u.getEmail().toLowerCase()))
                .collect(Collectors.toList());

        if (unassigned.isEmpty()) {
            return "All registered employees currently have at least one assigned task in the pipeline.";
        }

        StringBuilder sb = new StringBuilder(String.format("%d employee(s) currently have no assigned tasks:\n", unassigned.size()));
        for (User u : unassigned) {
            sb.append(String.format("• %s — %s (%s, %s)\n", u.getName(), u.getRole(), u.getDepartment(), u.getEmail()));
        }
        return sb.toString();
    }
}
