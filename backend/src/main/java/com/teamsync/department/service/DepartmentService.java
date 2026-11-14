package com.teamsync.department.service;

import com.teamsync.department.dto.CreateDepartmentRequest;
import com.teamsync.department.dto.DepartmentDto;
import com.teamsync.department.model.Department;
import com.teamsync.department.repository.DepartmentRepository;
import com.teamsync.exception.BadRequestException;
import com.teamsync.exception.ResourceNotFoundException;
import com.teamsync.task.model.TaskActivity;
import com.teamsync.task.repository.TaskActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final TaskActivityRepository taskActivityRepository;

    public List<DepartmentDto> getDepartments(String companyId) {
        List<Department> list;
        if (StringUtils.hasText(companyId)) {
            list = departmentRepository.findAllByCompanyId(companyId);
        } else {
            list = departmentRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public DepartmentDto getDepartmentById(String id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return toDto(dept);
    }

    public DepartmentDto createDepartment(CreateDepartmentRequest request, String companyId) {
        if (departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("A department with this name already exists");
        }

        String leadAvatar = StringUtils.hasText(request.getLeadAvatar())
                ? request.getLeadAvatar()
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

        Department dept = Department.builder()
                .name(request.getName().trim())
                .description(StringUtils.hasText(request.getDescription()) ? request.getDescription().trim() : "Cross-functional department focused on key organizational objectives.")
                .leadName(request.getLeadName().trim())
                .leadAvatar(leadAvatar)
                .memberCount(request.getMemberCount() != null ? request.getMemberCount() : 1)
                .activeProjects(request.getActiveProjects() != null ? request.getActiveProjects() : 1)
                .budget(StringUtils.hasText(request.getBudget()) ? request.getBudget() : "$250,000")
                .color(StringUtils.hasText(request.getColor()) ? request.getColor() : "from-violet-600 to-indigo-600")
                .companyId(companyId)
                .build();

        Department saved = departmentRepository.save(dept);

        // Record Activity
        taskActivityRepository.save(TaskActivity.builder()
                .companyId(companyId)
                .user(saved.getLeadName())
                .avatar(saved.getLeadAvatar())
                .action("inaugurated department")
                .target(saved.getName())
                .createdAt(Instant.now())
                .build());

        return toDto(saved);
    }

    public DepartmentDto updateDepartment(String id, CreateDepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        if (StringUtils.hasText(request.getName())) dept.setName(request.getName().trim());
        if (StringUtils.hasText(request.getDescription())) dept.setDescription(request.getDescription().trim());
        if (StringUtils.hasText(request.getLeadName())) dept.setLeadName(request.getLeadName().trim());
        if (StringUtils.hasText(request.getLeadAvatar())) dept.setLeadAvatar(request.getLeadAvatar().trim());
        if (request.getMemberCount() != null) dept.setMemberCount(request.getMemberCount());
        if (request.getActiveProjects() != null) dept.setActiveProjects(request.getActiveProjects());
        if (StringUtils.hasText(request.getBudget())) dept.setBudget(request.getBudget().trim());
        if (StringUtils.hasText(request.getColor())) dept.setColor(request.getColor().trim());

        return toDto(departmentRepository.save(dept));
    }

    public void deleteDepartment(String id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        departmentRepository.delete(dept);
    }

    public DepartmentDto toDto(Department d) {
        return DepartmentDto.builder()
                .id(d.getId())
                .companyId(d.getCompanyId())
                .name(d.getName())
                .description(d.getDescription())
                .leadName(d.getLeadName())
                .leadAvatar(d.getLeadAvatar())
                .memberCount(d.getMemberCount())
                .activeProjects(d.getActiveProjects())
                .budget(d.getBudget())
                .color(d.getColor())
                .createdAt(d.getCreatedAt())
                .updatedAt(d.getUpdatedAt())
                .build();
    }
}

