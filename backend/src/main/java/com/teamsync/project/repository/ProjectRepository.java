package com.teamsync.project.repository;

import com.teamsync.project.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {

    Optional<Project> findByNameIgnoreCase(String name);

    Optional<Project> findByCompanyIdAndNameIgnoreCase(String companyId, String name);

    List<Project> findAllByCompanyId(String companyId);

    List<Project> findByStatusIgnoreCase(String status);

    List<Project> findByCompanyIdAndStatusIgnoreCase(String companyId, String status);

    List<Project> findByDepartmentIgnoreCase(String department);
}

