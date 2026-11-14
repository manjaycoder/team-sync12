package com.teamsync.department.repository;

import com.teamsync.department.model.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {

    Optional<Department> findByNameIgnoreCase(String name);

    Optional<Department> findByCompanyIdAndNameIgnoreCase(String companyId, String name);

    boolean existsByNameIgnoreCase(String name);

    List<Department> findAllByCompanyId(String companyId);
}

