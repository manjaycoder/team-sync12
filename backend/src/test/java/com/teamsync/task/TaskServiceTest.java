package com.teamsync.task;

import com.teamsync.notification.repository.NotificationRepository;
import com.teamsync.project.repository.ProjectRepository;
import com.teamsync.project.service.ProjectService;
import com.teamsync.task.dto.CreateTaskRequest;
import com.teamsync.task.dto.TaskDto;
import com.teamsync.task.dto.UpdateTaskRequest;
import com.teamsync.task.model.Task;
import com.teamsync.task.repository.TaskActivityRepository;
import com.teamsync.task.repository.TaskRepository;
import com.teamsync.task.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskActivityRepository taskActivityRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectService projectService;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private TaskService taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = Task.builder()
                .id("task-01")
                .companyId("comp-01")
                .title("Build Spring Boot MongoDB Layer")
                .projectName("Core Platform")
                .department("Engineering")
                .assigneeName("Alex Morgan")
                .assigneeEmail("alex@teamsync.space")
                .status("todo")
                .priority("high")
                .build();
    }

    @Test
    @DisplayName("Create Task: Successfully persists task and triggers project progress sync")
    void testCreateTask() {
        CreateTaskRequest request = CreateTaskRequest.builder()
                .title("Build Spring Boot MongoDB Layer")
                .projectName("Core Platform")
                .assigneeName("Alex Morgan")
                .assigneeEmail("alex@teamsync.space")
                .status("todo")
                .build();

        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskDto result = taskService.createTask(request, "comp-01");

        assertNotNull(result);
        assertEquals("Build Spring Boot MongoDB Layer", result.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(projectService, times(1)).syncProjectProgress(any(), any());
    }

    @Test
    @DisplayName("AI Complete Task: Sets completed status, completedByAI flag, and summary")
    void testAiCompleteTask() {
        when(taskRepository.findById("task-01")).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TaskDto result = taskService.aiCompleteTask("task-01");

        assertNotNull(result);
        assertEquals("completed", result.getStatus());
        assertTrue(result.isCompletedByAI());
        assertNotNull(result.getAiCompletionSummary());
        verify(projectService, times(1)).syncProjectProgress(eq("Core Platform"), any());
    }

    @Test
    @DisplayName("Update Task: Transitions status and synchronizes project progress")
    void testUpdateTaskStatus() {
        when(taskRepository.findById("task-01")).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateTaskRequest updateRequest = UpdateTaskRequest.builder()
                .status("in_progress")
                .build();

        TaskDto result = taskService.updateTask("task-01", updateRequest);

        assertNotNull(result);
        assertEquals("in_progress", result.getStatus());
        verify(projectService, times(1)).syncProjectProgress(eq("Core Platform"), any());
    }
}
