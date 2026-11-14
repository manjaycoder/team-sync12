package com.teamsync.company.repository;

import com.teamsync.company.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    Optional<Company> findByNameIgnoreCase(String name);

    Optional<Company> findBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);
}

