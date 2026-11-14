package com.teamsync.employee.service;

import com.teamsync.employee.dto.CreateEmployeeRequest;
import com.teamsync.employee.dto.EmployeeDto;
import com.teamsync.employee.dto.UpdateEmployeeRequest;
import com.teamsync.employee.model.User;
import com.teamsync.employee.repository.UserRepository;
import com.teamsync.exception.BadRequestException;
import com.teamsync.exception.ResourceNotFoundException;
import com.teamsync.task.model.TaskActivity;
import com.teamsync.task.repository.TaskActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepository;
    private final TaskActivityRepository taskActivityRepository;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    public List<EmployeeDto> getEmployees(String search, String department, String status, String companyId) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (StringUtils.hasText(companyId)) {
            criteriaList.add(Criteria.where("companyId").is(companyId));
        }

        if (StringUtils.hasText(search)) {
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("name").regex(search, "i"),
                    Criteria.where("email").regex(search, "i"),
                    Criteria.where("role").regex(search, "i")
            );
            criteriaList.add(searchCriteria);
        }

        if (StringUtils.hasText(department) && !"All".equalsIgnoreCase(department)) {
            criteriaList.add(Criteria.where("department").is(department));
        }

        if (StringUtils.hasText(status) && !"All".equalsIgnoreCase(status)) {
            criteriaList.add(Criteria.where("status").is(status));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        return mongoTemplate.find(query, User.class).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return toDto(user);
    }

    public EmployeeDto createEmployee(CreateEmployeeRequest request, String companyId) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BadRequestException("An employee with this email already exists");
        }

        String rawPassword = StringUtils.hasText(request.getPassword()) ? request.getPassword() : "TemporaryPassword123!";
        String avatar = StringUtils.hasText(request.getAvatar())
                ? request.getAvatar()
                : String.format("https://images.unsplash.com/photo-%d?w=150&auto=format&fit=crop&q=80",
                1500000000000L + Math.abs(request.getEmail().hashCode() % 1000000));

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(rawPassword))
                .companyId(companyId)
                .role(request.getRole().trim())
                .department(StringUtils.hasText(request.getDepartment()) ? request.getDepartment().trim() : "Engineering")
                .status(StringUtils.hasText(request.getStatus()) ? request.getStatus().trim() : "active")
                .location(StringUtils.hasText(request.getLocation()) ? request.getLocation().trim() : "Remote")
                .avatar(avatar)
                .joinedDate("Nov 2026")
                .roles(Set.of("ROLE_EMPLOYEE"))
                .enabled(true)
                .build();

        User saved = userRepository.save(user);

        // Record Activity
        taskActivityRepository.save(TaskActivity.builder()
                .companyId(companyId)
                .user(saved.getName())
                .avatar(saved.getAvatar())
                .action("joined as")
                .target(String.format("%s (%s)", saved.getRole(), saved.getDepartment()))
                .createdAt(Instant.now())
                .build());

        return toDto(saved);
    }

    public EmployeeDto updateEmployee(String id, UpdateEmployeeRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (StringUtils.hasText(request.getName())) user.setName(request.getName().trim());
        if (StringUtils.hasText(request.getEmail())) user.setEmail(request.getEmail().trim().toLowerCase());
        if (StringUtils.hasText(request.getRole())) user.setRole(request.getRole().trim());
        if (StringUtils.hasText(request.getDepartment())) user.setDepartment(request.getDepartment().trim());
        if (StringUtils.hasText(request.getStatus())) user.setStatus(request.getStatus().trim());
        if (StringUtils.hasText(request.getLocation())) user.setLocation(request.getLocation().trim());
        if (StringUtils.hasText(request.getAvatar())) user.setAvatar(request.getAvatar().trim());

        return toDto(userRepository.save(user));
    }

    public void deleteEmployee(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        userRepository.delete(user);

        // Record Activity
        taskActivityRepository.save(TaskActivity.builder()
                .companyId(user.getCompanyId())
                .user("Admin")
                .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80")
                .action("archived employee profile for")
                .target(user.getName())
                .createdAt(Instant.now())
                .build());
    }

    public EmployeeDto toDto(User u) {
        return EmployeeDto.builder()
                .id(u.getId())
                .companyId(u.getCompanyId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .department(u.getDepartment())
                .status(u.getStatus())
                .avatar(u.getAvatar())
                .location(u.getLocation())
                .joinedDate(u.getJoinedDate())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }
}

