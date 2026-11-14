package com.teamsync.company.service;

import com.teamsync.company.dto.CompanyDto;
import com.teamsync.company.dto.CreateCompanyRequest;
import com.teamsync.company.model.Company;
import com.teamsync.company.repository.CompanyRepository;
import com.teamsync.exception.BadRequestException;
import com.teamsync.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyDto createCompany(CreateCompanyRequest request, String ownerId) {
        if (companyRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("A company with this name already exists");
        }

        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");

        Company company = Company.builder()
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription() != null ? request.getDescription() : "Enterprise workspace on Team-Sync")
                .ownerId(ownerId)
                .plan(request.getPlan() != null ? request.getPlan() : "ENTERPRISE")
                .logo(request.getLogo() != null ? request.getLogo() : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80")
                .active(true)
                .build();

        return toDto(companyRepository.save(company));
    }

    public CompanyDto getCompanyById(String id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return toDto(company);
    }

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CompanyDto updateCompany(String id, CreateCompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            company.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            company.setDescription(request.getDescription());
        }
        if (request.getLogo() != null) {
            company.setLogo(request.getLogo());
        }
        if (request.getPlan() != null) {
            company.setPlan(request.getPlan());
        }

        return toDto(companyRepository.save(company));
    }

    private CompanyDto toDto(Company c) {
        return CompanyDto.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .ownerId(c.getOwnerId())
                .plan(c.getPlan())
                .logo(c.getLogo())
                .active(c.isActive())
                .createdAt(c.getCreatedAt())
                .build();
    }
}

