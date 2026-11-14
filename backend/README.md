# Team-Sync — Java 21 + Spring Boot 3 + MongoDB Modular Monolith Backend

Enterprise-grade, high-throughput team collaboration, project management, and workforce intelligence backend engineered with **Java 21**, **Spring Boot 3.3**, and **MongoDB**.

---

## 1. Architectural Overview: Modular Monolith

Team-Sync is structured as a **Modular Monolith**. Rather than introducing fragile distributed microservices or relational database bottlenecks, the platform delivers zero-latency in-memory communication across cohesive business modules while persisting state in a unified **MongoDB** multi-tenant document cluster.

```
backend/src/main/java/com/teamsync/
├── TeamSyncApplication.java        # Spring Boot 3 & Mongo Auditing Entrypoint
│
├── config/                         # Infrastructure & API Specifications
│   ├── CorsConfig.java             # Zero-trust CORS policies (Vercel, Vite, Localhost)
│   ├── DataInitializer.java        # Automated enterprise workspace seeder
│   └── OpenApiConfig.java          # Swagger OpenAPI 3.0 Documentation Bean
│
├── security/                       # Zero-Trust Security Perimeter
│   ├── SecurityConfig.java         # Stateless Spring Security Filter Chain
│   ├── JwtTokenProvider.java       # HMAC-SHA256 JWT access & refresh token engine
│   ├── JwtAuthenticationFilter.java# Bearer token & cookie resolver
│   ├── CustomUserDetailsService.java
│   └── UserPrincipal.java          # Spring Security UserDetails representation
│
├── common/                         # Shared Utilities & Base Entities
│   ├── AuditableEntity.java        # Automatic createdAt / updatedAt timestamps
│   ├── ApiResponse.java            # Standardized API response envelope
│   ├── CompanyContext.java         # ThreadLocal multi-tenant company isolation
│   ├── AuditLog.java               # Immutable audit logging document
│   └── HealthController.java       # Liveness & readiness health probe (/api/health)
│
├── exception/                      # Global Resilience & Error Handling
│   ├── GlobalExceptionHandler.java # REST exception interception
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── UnauthorizedException.java
│
├── auth/                           # Authentication & Token Rotation Module
│   ├── controller/AuthController.java
│   ├── service/AuthService.java
│   ├── repository/RefreshTokenRepository.java
│   ├── model/RefreshToken.java
│   └── dto/                        # Login, Register, AuthResponse, RefreshToken
│
├── company/                        # Multi-Tenant Company Organization Module
│   ├── controller/CompanyController.java
│   ├── service/CompanyService.java
│   ├── repository/CompanyRepository.java
│   ├── model/Company.java
│   └── dto/CompanyDto.java
│
├── employee/                       # Employee Directory & Profile Module
│   ├── controller/EmployeeController.java
│   ├── service/EmployeeService.java
│   ├── repository/UserRepository.java
│   ├── model/User.java
│   └── dto/EmployeeDto.java
│
├── department/                     # Department Hierarchy & Budget Module
│   ├── controller/DepartmentController.java
│   ├── service/DepartmentService.java
│   ├── repository/DepartmentRepository.java
│   ├── model/Department.java
│   └── dto/DepartmentDto.java
│
├── project/                        # Project Portfolio & Progress Sync Module
│   ├── controller/ProjectController.java
│   ├── service/ProjectService.java
│   ├── repository/ProjectRepository.java
│   ├── model/Project.java
│   └── dto/ProjectDto.java
│
├── task/                           # Kanban Task Lifecycle & Allocation Module
│   ├── controller/TaskController.java
│   ├── service/TaskService.java
│   ├── repository/TaskRepository.java
│   ├── repository/TaskActivityRepository.java
│   ├── model/Task.java & TaskActivity.java
│   └── dto/TaskDto.java
│
├── notification/                   # In-App Alerts & Activity Notifications
│   ├── controller/NotificationController.java
│   ├── service/NotificationService.java
│   ├── repository/NotificationRepository.java
│   ├── model/Notification.java
│   └── dto/NotificationDto.java
│
├── ai/                             # Google Gemini AI & Controlled Tool Calling
│   ├── controller/AiController.java
│   ├── service/AiService.java      # REST LLM integration & conversation memory
│   ├── service/AiToolExecutor.java # Authorized function calling service tools
│   ├── repository/ConversationRepository.java
│   ├── repository/ChatMessageRepository.java
│   ├── model/Conversation.java & ChatMessage.java
│   └── dto/                        # AI Assistant, Standup, SyncBriefing
│
└── dashboard/                      # Real-Time Telemetry & Aggregation Module
    ├── controller/DashboardController.java
    ├── service/DashboardService.java # MongoDB Aggregation Framework pipelines
    └── dto/DashboardStatsResponse.java & EmployeeWorkloadDto.java
```

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Language & Runtime** | Java 21 (Eclipse Temurin / OpenJDK) |
| **Framework** | Spring Boot 3.3.5 (Spring MVC, Spring Data MongoDB, Spring Security) |
| **Database** | MongoDB 7.0 / MongoDB Atlas |
| **Security & Identity** | Spring Security 6, JJWT (0.12.6), BCrypt, RBAC, Multi-tenant Isolation |
| **API Documentation** | OpenAPI 3.0 / Swagger UI (`springdoc-openapi-starter-webmvc-ui` 2.6.0) |
| **AI Integration** | Google Gemini API + Controlled Function Calling & Conversation Memory |
| **Observability** | Spring Boot Actuator, Micrometer Prometheus Registry, Grafana |
| **DevOps** | Multi-stage Dockerfile, Docker Compose, Kubernetes manifests, GitHub Actions |
| **Build Tool** | Apache Maven 3.9+ |

---

## 3. MongoDB Collection Design

All application state is maintained in MongoDB collections optimized with compound indexes:

1. **`users`**: Employee accounts with encrypted credentials, department, role, status (`active`, `remote`, `on_leave`), and multi-tenant `companyId`.
2. **`companies`**: Enterprise tenant accounts, slug, subscription tier (`ENTERPRISE`), and workspace settings.
3. **`departments`**: Divisions, budgets, member count, active projects, and lead credentials.
4. **`projects`**: Strategic project initiatives, progress calculations (0-100%), budgets, and deadlines.
5. **`tasks`**: Kanban deliverables with priority, assignee, status (`todo`, `in_progress`, `review`, `completed`, `blocked`, `overdue`), and AI completion metadata.
6. **`task_activities`**: Real-time audit trail of allocations, completions, and status changes.
7. **`notifications`**: Targeted employee notifications for task assignments and milestone updates.
8. **`refresh_tokens`**: Cryptographically secure refresh token rotation records.
9. **`conversations`**: AI assistant user chat threads.
10. **`chat_messages`**: Persistent conversational memory with tool execution history.
11. **`audit_logs`**: System audit trails for compliance.

---

## 4. REST API Catalog

All endpoints match the existing Team-Sync frontend API contracts:

### Health & Monitoring
- `GET /api/health` — Liveness/readiness probe
- `GET /actuator/prometheus` — Prometheus metric exporter
- `GET /swagger-ui.html` — Interactive OpenAPI Swagger UI

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new employee & company
- `POST /api/auth/login` — Authenticate and receive JWT access token + refresh token
- `GET /api/auth/me` — Retrieve current authenticated session
- `POST /api/auth/refresh` — Rotate refresh token and issue new JWT
- `POST /api/auth/logout` — Invalidate session and clear cookies

### Employees (`/api/employees`)
- `GET /api/employees?search=&department=&status=` — List and filter employees
- `GET /api/employees/{id}` — Get single employee profile
- `POST /api/employees` — Add new employee
- `PUT /api/employees/{id}` — Update employee details
- `DELETE /api/employees/{id}` — Archive employee

### Departments (`/api/departments`)
- `GET /api/departments` — List all departments
- `GET /api/departments/{id}` — Single department details
- `POST /api/departments` — Create new department
- `PUT /api/departments/{id}` — Update department budget / lead
- `DELETE /api/departments/{id}` — Remove department

### Projects (`/api/projects`)
- `GET /api/projects` — List all projects
- `GET /api/projects/{id}` — Single project details
- `POST /api/projects` — Create project
- `PUT /api/projects/{id}` — Update project status / progress
- `DELETE /api/projects/{id}` — Delete project

### Tasks (`/api/tasks`)
- `GET /api/tasks?assigneeEmail=&projectId=&status=&department=` — Search tasks
- `GET /api/tasks/{id}` — Single task details
- `POST /api/tasks` — Allocate task (triggers project progress auto-sync)
- `PUT /api/tasks/{id}` — Update status / details
- `DELETE /api/tasks/{id}` — Delete task
- `POST /api/tasks/{id}/ai-complete` — Complete task via Google Gemini AI

### AI Assistant & Briefings (`/api/ai`)
- `POST /api/ai/assistant` — Natural language chatbot with controlled tool calling
- `POST /api/ai/sync-briefing` — High-level workspace velocity briefing
- `POST /api/ai/standup` — Department standup agenda generator
- `GET /api/ai/activities` — Real-time activity feed

### Dashboard Analytics (`/api/dashboard`)
- `GET /api/dashboard/stats` — Overall task counts, completion rate, status distribution
- `GET /api/dashboard/workload` — Employee workload calculated via MongoDB aggregation

---

## 5. Controlled AI Tool Execution

The AI Assistant enforces strict zero-trust data retrieval. The LLM **never** executes raw database queries. Instead, queries are parsed and routed through strictly authorized Java application service tools:

1. `getWorkingEmployees(companyId)` — Active/remote workforce roster.
2. `getPendingTasks(companyId)` — Backlog deliverables.
3. `getEmployeesWithOverdueTasks(companyId)` — Blocked or overdue tasks.
4. `getEmployeeTasks(emailOrName, companyId)` — Specific employee workload.
5. `summarizeTodayActivities(companyId)` — Recent audit activity stream.
6. `getTasksDueSoon(companyId)` — Approaching milestone deadlines.
7. `getTaskCompletionPercentage(companyId)` — Velocity and percentage metrics.
8. `getEmployeesWithNoTasks(companyId)` — Available capacity detection.

---

## 6. How to Run Locally

### Option A: Using Docker Compose (Recommended)
Spins up MongoDB, the Spring Boot 3 backend, Prometheus, and Grafana with one command:

```bash
docker compose up --build
```

- **Backend API**: `http://localhost:5001`
- **Swagger Documentation**: `http://localhost:5001/swagger-ui.html`
- **Prometheus Metrics**: `http://localhost:9090`
- **Grafana Dashboard**: `http://localhost:3001` (user: `admin`, pass: `admin`)

### Option B: Local Spring Boot Application
1. Ensure MongoDB is running locally (`mongodb://localhost:27017`) or configure `MONGO_URI`.
2. From the `backend` directory, run:
```bash
mvn clean spring-boot:run
```

---

## 7. Connecting Existing React / Vite Frontend

The existing React frontend connects to this backend with zero UI changes:
1. Ensure your `.env` or `.env.local` contains:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
2. Start the frontend:
   ```bash
   npm run dev:client
   ```
3. Visit `http://localhost:5173`. All features (Kanban, Analytics, Standups, AI Assistant) connect directly to the Spring Boot backend!
