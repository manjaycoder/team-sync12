package com.teamsync.auth.service;

import com.teamsync.auth.dto.AuthResponse;
import com.teamsync.auth.dto.LoginRequest;
import com.teamsync.auth.dto.RefreshTokenRequest;
import com.teamsync.auth.dto.RegisterRequest;
import com.teamsync.auth.model.RefreshToken;
import com.teamsync.auth.repository.RefreshTokenRepository;
import com.teamsync.company.model.Company;
import com.teamsync.company.repository.CompanyRepository;
import com.teamsync.employee.model.User;
import com.teamsync.employee.repository.UserRepository;
import com.teamsync.exception.BadRequestException;
import com.teamsync.exception.ResourceNotFoundException;
import com.teamsync.exception.UnauthorizedException;
import com.teamsync.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${teamsync.jwt.refresh-expiration-ms:2592000000}")
    private long refreshExpirationMs;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BadRequestException("User already exists with this email address");
        }

        // Determine or assign company
        String companyName = request.getCompanyName() != null && !request.getCompanyName().isBlank()
                ? request.getCompanyName().trim()
                : "Team-Sync Global";

        Company company = companyRepository.findByNameIgnoreCase(companyName)
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name(companyName)
                        .slug(companyName.toLowerCase().replaceAll("[^a-z0-9]", "-"))
                        .description("Enterprise organization on Team-Sync")
                        .build()));

        User user = User.builder()
                .name(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .companyId(company.getId())
                .role(request.getRole() != null ? request.getRole() : "Team Member")
                .department(request.getDepartment() != null ? request.getDepartment() : "Engineering")
                .status("active")
                .avatar(String.format("https://images.unsplash.com/photo-%d?w=150&auto=format&fit=crop&q=80",
                        1534528741775L + Math.abs(request.getEmail().hashCode() % 100000)))
                .location("Remote")
                .joinedDate("Nov 2026")
                .roles(Set.of("ROLE_EMPLOYEE"))
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        // If company didn't have an owner, set this first user as owner
        if (company.getOwnerId() == null) {
            company.setOwnerId(savedUser.getId());
            companyRepository.save(company);
        }

        String accessToken = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getCompanyId());
        String refreshToken = createRefreshToken(savedUser.getId());

        return toAuthResponse(savedUser, accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String accessToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getCompanyId());
        String refreshToken = createRefreshToken(user.getId());

        return toAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (token.isRevoked() || token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token is expired or revoked. Please log in again.");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Rotate refresh token
        refreshTokenRepository.delete(token);
        String newRefreshToken = createRefreshToken(user.getId());
        String newAccessToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getCompanyId());

        return toAuthResponse(user, newAccessToken, newRefreshToken);
    }

    public AuthResponse getMe(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return toAuthResponse(user, null, null);
    }

    public void logout(String userId) {
        if (userId != null) {
            refreshTokenRepository.deleteByUserId(userId);
        }
    }

    private String createRefreshToken(String userId) {
        String token = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(token)
                .expiryDate(Instant.now().plusMillis(refreshExpirationMs))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
        return token;
    }

    private AuthResponse toAuthResponse(User user, String token, String refreshToken) {
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .department(user.getDepartment())
                .avatar(user.getAvatar())
                .status(user.getStatus())
                .location(user.getLocation())
                .joinedDate(user.getJoinedDate())
                .companyId(user.getCompanyId())
                .token(token)
                .refreshToken(refreshToken)
                .build();
    }
}

