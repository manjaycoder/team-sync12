package com.teamsync.employee.repository;

import com.teamsync.employee.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<User> findAllByCompanyId(String companyId);

    long countByCompanyId(String companyId);

    List<User> findByDepartmentIgnoreCase(String department);

    List<User> findByCompanyIdAndDepartmentIgnoreCase(String companyId, String department);
}

