package com.teamsync.dashboard;

import com.teamsync.dashboard.dto.DashboardStatsResponse;
import com.teamsync.dashboard.service.DashboardService;
import com.teamsync.department.repository.DepartmentRepository;
import com.teamsync.employee.repository.UserRepository;
import com.teamsync.project.repository.ProjectRepository;
import com.teamsync.task.model.Task;
import com.teamsync.task.repository.TaskRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    @DisplayName("Dashboard Stats: Accurately aggregates task status counts and completion rate")
    void testGetDashboardStats() {
        Task t1 = Task.builder().status("completed").priority("high").build();
        Task t2 = Task.builder().status("in_progress").priority("medium").build();
        Task t3 = Task.builder().status("todo").priority("low").build();
        Task t4 = Task.builder().status("completed").completedByAI(true).priority("urgent").build();

        when(userRepository.countByCompanyId("comp-01")).thenReturn(10L);
        when(departmentRepository.findAllByCompanyId("comp-01")).thenReturn(List.of());
        when(projectRepository.findAllByCompanyId("comp-01")).thenReturn(List.of());
        when(taskRepository.findAllByCompanyId("comp-01")).thenReturn(List.of(t1, t2, t3, t4));

        DashboardStatsResponse stats = dashboardService.getDashboardStats("comp-01");

        assertNotNull(stats);
        assertEquals(10L, stats.getTotalEmployees());
        assertEquals(4L, stats.getTotalTasks());
        assertEquals(2L, stats.getCompletedTasks());
        assertEquals(1L, stats.getInProgressTasks());
        assertEquals(1L, stats.getPendingTasks());
        assertEquals(1L, stats.getAiCompletedTasks());
        assertEquals(50.0, stats.getCompletionRate());
    }
}
