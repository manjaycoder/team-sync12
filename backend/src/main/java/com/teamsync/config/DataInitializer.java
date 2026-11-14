package com.teamsync.config;

import com.teamsync.company.model.Company;
import com.teamsync.company.repository.CompanyRepository;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final TaskActivityRepository taskActivityRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${teamsync.auto-seed:true}")
    private boolean autoSeed;

    @Override
    public void run(String... args) {
        if (!autoSeed) {
            log.info("Auto-seed is disabled.");
            return;
        }

        try {
            if (userRepository.count() > 0 && departmentRepository.count() > 0) {
                log.info("MongoDB already contains initialized data. Skipping seeder.");
                return;
            }

            log.info("Seeding initial enterprise workspace into MongoDB...");

            // 1. Company
            Company company = companyRepository.save(Company.builder()
                    .name("Team-Sync Enterprise")
                    .slug("teamsync-enterprise")
                    .description("Global AI-first enterprise project and workforce intelligence workspace.")
                    .plan("ENTERPRISE")
                    .active(true)
                    .build());

            String companyId = company.getId();

            // 2. Departments
            Department dEng = departmentRepository.save(Department.builder()
                    .companyId(companyId)
                    .name("Engineering")
                    .description("Core infrastructure, platform architecture, and distributed services.")
                    .leadName("Alex Morgan")
                    .leadAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                    .memberCount(18)
                    .activeProjects(8)
                    .budget("$450,000")
                    .color("from-blue-600 to-indigo-600")
                    .build());

            Department dAi = departmentRepository.save(Department.builder()
                    .companyId(companyId)
                    .name("AI Research")
                    .description("Large language model orchestration, synthetic reasoning, and agent pipelines.")
                    .leadName("Elena Rostova")
                    .leadAvatar("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80")
                    .memberCount(12)
                    .activeProjects(5)
                    .budget("$380,000")
                    .color("from-purple-600 to-pink-600")
                    .build());

            Department dProd = departmentRepository.save(Department.builder()
                    .companyId(companyId)
                    .name("Product & Design")
                    .description("Awwwards-grade monochromatic user interfaces, 3D WebGL visuals, and ergonomic UX.")
                    .leadName("Marcus Chen")
                    .leadAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                    .memberCount(9)
                    .activeProjects(4)
                    .budget("$220,000")
                    .color("from-amber-500 to-orange-600")
                    .build());

            Department dOps = departmentRepository.save(Department.builder()
                    .companyId(companyId)
                    .name("Operations & Security")
                    .description("SOC2 compliance, zero-trust perimeter, and cloud deployment pipelines.")
                    .leadName("David Kim")
                    .leadAvatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
                    .memberCount(6)
                    .activeProjects(4)
                    .budget("$290,000")
                    .color("from-emerald-500 to-teal-600")
                    .build());

            Department dMkt = departmentRepository.save(Department.builder()
                    .companyId(companyId)
                    .name("Marketing & Growth")
                    .description("Global enterprise go-to-market and community engineering.")
                    .leadName("Priya Sharma")
                    .leadAvatar("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
                    .memberCount(7)
                    .activeProjects(3)
                    .budget("$175,000")
                    .color("from-cyan-500 to-blue-600")
                    .build());

            // 3. Employees
            String defaultPwd = passwordEncoder.encode("Password123!");

            User uAlex = userRepository.save(User.builder()
                    .companyId(companyId)
                    .name("Alex Morgan")
                    .email("alex.morgan@team-sync.space")
                    .password(defaultPwd)
                    .role("Lead Systems Architect")
                    .department(dEng.getName())
                    .status("active")
                    .location("San Francisco, CA")
                    .joinedDate("Jan 2025")
                    .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                    .roles(Set.of("ROLE_ADMIN", "ROLE_EMPLOYEE"))
                    .build());

            User uElena = userRepository.save(User.builder()
                    .companyId(companyId)
                    .name("Elena Rostova")
                    .email("elena.r@team-sync.space")
                    .password(defaultPwd)
                    .role("Principal AI Scientist")
                    .department(dAi.getName())
                    .status("remote")
                    .location("Zurich, Switzerland")
                    .joinedDate("Mar 2025")
                    .avatar("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80")
                    .roles(Set.of("ROLE_MANAGER", "ROLE_EMPLOYEE"))
                    .build());

            User uMarcus = userRepository.save(User.builder()
                    .companyId(companyId)
                    .name("Marcus Chen")
                    .email("marcus.c@team-sync.space")
                    .password(defaultPwd)
                    .role("Staff Product Designer")
                    .department(dProd.getName())
                    .status("active")
                    .location("Tokyo, Japan")
                    .joinedDate("Jun 2025")
                    .avatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                    .roles(Set.of("ROLE_EMPLOYEE"))
                    .build());

            User uDavid = userRepository.save(User.builder()
                    .companyId(companyId)
                    .name("David Kim")
                    .email("david.k@team-sync.space")
                    .password(defaultPwd)
                    .role("Head of Infrastructure")
                    .department(dOps.getName())
                    .status("active")
                    .location("Austin, TX")
                    .joinedDate("Feb 2025")
                    .avatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
                    .roles(Set.of("ROLE_EMPLOYEE"))
                    .build());

            User uPriya = userRepository.save(User.builder()
                    .companyId(companyId)
                    .name("Priya Sharma")
                    .email("priya.s@team-sync.space")
                    .password(defaultPwd)
                    .role("Director of Growth")
                    .department(dMkt.getName())
                    .status("remote")
                    .location("London, UK")
                    .joinedDate("May 2025")
                    .avatar("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
                    .roles(Set.of("ROLE_EMPLOYEE"))
                    .build());

            User uSophia = userRepository.save(User.builder()
                    .companyId(companyId)
                    .name("Sophia Al-Mansoor")
                    .email("sophia.a@team-sync.space")
                    .password(defaultPwd)
                    .role("Senior Full-Stack Engineer")
                    .department(dEng.getName())
                    .status("active")
                    .location("New York, NY")
                    .joinedDate("Aug 2025")
                    .avatar("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80")
                    .roles(Set.of("ROLE_EMPLOYEE"))
                    .build());

            company.setOwnerId(uAlex.getId());
            companyRepository.save(company);

            // 4. Projects
            Project pAi = projectRepository.save(Project.builder()
                    .companyId(companyId)
                    .name("Quantum Mesh Neural Engine")
                    .description("Distributed neural inference pipeline running LLM function calling with sub-50ms latency.")
                    .department(dAi.getName())
                    .leadName(uElena.getName())
                    .leadAvatar(uElena.getAvatar())
                    .status("active")
                    .priority("urgent")
                    .progress(72)
                    .budget("$210,000")
                    .deadline("Dec 2026")
                    .build());

            Project pDes = projectRepository.save(Project.builder()
                    .companyId(companyId)
                    .name("Monochromatic Awwwards Design System")
                    .description("High-contrast black & white WebGL 3D design system with Framer Motion and Three.js physics.")
                    .department(dProd.getName())
                    .leadName(uMarcus.getName())
                    .leadAvatar(uMarcus.getAvatar())
                    .status("active")
                    .priority("high")
                    .progress(88)
                    .budget("$140,000")
                    .deadline("Nov 2026")
                    .build());

            Project pSec = projectRepository.save(Project.builder()
                    .companyId(companyId)
                    .name("Enterprise SOC2 Telemetry Vault")
                    .description("Automated zero-trust cryptographic audit trail and Prometheus telemetry instrumentation.")
                    .department(dOps.getName())
                    .leadName(uDavid.getName())
                    .leadAvatar(uDavid.getAvatar())
                    .status("active")
                    .priority("high")
                    .progress(94)
                    .budget("$180,000")
                    .deadline("Q1 2027")
                    .build());

            Project pEng = projectRepository.save(Project.builder()
                    .companyId(companyId)
                    .name("Java Spring Boot Modular Monolith")
                    .description("High-throughput enterprise backend migration with Java 21, Spring Boot 3, and MongoDB.")
                    .department(dEng.getName())
                    .leadName(uAlex.getName())
                    .leadAvatar(uAlex.getAvatar())
                    .status("active")
                    .priority("urgent")
                    .progress(85)
                    .budget("$160,000")
                    .deadline("Nov 2026")
                    .build());

            // 5. Tasks
            taskRepository.saveAll(List.of(
                    Task.builder()
                            .companyId(companyId)
                            .title("Architect MongoDB aggregation pipelines for telemetry")
                            .description("Implement efficient Spring Data aggregation queries for real-time workload calculations.")
                            .projectId(pEng.getId())
                            .projectName(pEng.getName())
                            .department(dEng.getName())
                            .assigneeId(uAlex.getId())
                            .assigneeName(uAlex.getName())
                            .assigneeEmail(uAlex.getEmail())
                            .assigneeAvatar(uAlex.getAvatar())
                            .status("completed")
                            .priority("urgent")
                            .dueDate("Nov 20, 2026")
                            .estimatedHours(12)
                            .completedByAI(true)
                            .aiCompletionSummary("Pipeline architecture verified with 100% throughput performance on MongoDB replica set.")
                            .completedAt("Nov 14, 2026")
                            .build(),

                    Task.builder()
                            .companyId(companyId)
                            .title("Implement Spring AI tool calling for agent chatbot")
                            .description("Expose controlled application service tools for answering questions without direct DB exposure.")
                            .projectId(pAi.getId())
                            .projectName(pAi.getName())
                            .department(dAi.getName())
                            .assigneeId(uElena.getId())
                            .assigneeName(uElena.getName())
                            .assigneeEmail(uElena.getEmail())
                            .assigneeAvatar(uElena.getAvatar())
                            .status("in_progress")
                            .priority("high")
                            .dueDate("Nov 22, 2026")
                            .estimatedHours(16)
                            .build(),

                    Task.builder()
                            .companyId(companyId)
                            .title("Optimize Three.js WebGL canvas LOD and frame rates")
                            .description("Fine-tune React Three Fiber geometries, camera damping, and GPU buffer management.")
                            .projectId(pDes.getId())
                            .projectName(pDes.getName())
                            .department(dProd.getName())
                            .assigneeId(uMarcus.getId())
                            .assigneeName(uMarcus.getName())
                            .assigneeEmail(uMarcus.getEmail())
                            .assigneeAvatar(uMarcus.getAvatar())
                            .status("completed")
                            .priority("medium")
                            .dueDate("Nov 18, 2026")
                            .estimatedHours(10)
                            .completedAt("Nov 12, 2026")
                            .build(),

                    Task.builder()
                            .companyId(companyId)
                            .title("Configure Prometheus and Grafana metrics dashboards")
                            .description("Export Micrometer metrics from Spring Boot Actuator and create monitoring panels.")
                            .projectId(pSec.getId())
                            .projectName(pSec.getName())
                            .department(dOps.getName())
                            .assigneeId(uDavid.getId())
                            .assigneeName(uDavid.getName())
                            .assigneeEmail(uDavid.getEmail())
                            .assigneeAvatar(uDavid.getAvatar())
                            .status("in_progress")
                            .priority("high")
                            .dueDate("Nov 25, 2026")
                            .estimatedHours(14)
                            .build(),

                    Task.builder()
                            .companyId(companyId)
                            .title("Verify multi-tenant company data isolation filters")
                            .description("Ensure ThreadLocal companyId context prevents unauthorized cross-tenant data access.")
                            .projectId(pEng.getId())
                            .projectName(pEng.getName())
                            .department(dEng.getName())
                            .assigneeId(uSophia.getId())
                            .assigneeName(uSophia.getName())
                            .assigneeEmail(uSophia.getEmail())
                            .assigneeAvatar(uSophia.getAvatar())
                            .status("todo")
                            .priority("urgent")
                            .dueDate("Nov 28, 2026")
                            .estimatedHours(8)
                            .build()
            ));

            // 6. Activities
            taskActivityRepository.saveAll(List.of(
                    TaskActivity.builder()
                            .companyId(companyId)
                            .user("Alex Morgan")
                            .avatar(uAlex.getAvatar())
                            .action("deployed modular monolith architecture for")
                            .target("Team-Sync Spring Boot 3 Engine")
                            .createdAt(Instant.now().minusSeconds(3600))
                            .build(),
                    TaskActivity.builder()
                            .companyId(companyId)
                            .user("Google Gemini AI")
                            .avatar("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80")
                            .action("AI-completed deliverable")
                            .target("Architect MongoDB aggregation pipelines")
                            .createdAt(Instant.now().minusSeconds(7200))
                            .build(),
                    TaskActivity.builder()
                            .companyId(companyId)
                            .user("Elena Rostova")
                            .avatar(uElena.getAvatar())
                            .action("initiated neural tool calling on")
                            .target("Quantum Mesh Neural Engine")
                            .createdAt(Instant.now().minusSeconds(10800))
                            .build()
            ));

            log.info("✓ Enterprise workspace successfully seeded into MongoDB!");
        } catch (Exception ex) {
            log.error("Error during enterprise data initialization: {}", ex.getMessage());
        }
    }
}
