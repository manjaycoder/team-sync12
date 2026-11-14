package com.teamsync.auth;

import com.teamsync.auth.dto.AuthResponse;
import com.teamsync.auth.dto.LoginRequest;
import com.teamsync.auth.dto.RegisterRequest;
import com.teamsync.auth.model.RefreshToken;
import com.teamsync.auth.repository.RefreshTokenRepository;
import com.teamsync.auth.service.AuthService;
import com.teamsync.company.model.Company;
import com.teamsync.company.repository.CompanyRepository;
import com.teamsync.employee.model.User;
import com.teamsync.employee.repository.UserRepository;
import com.teamsync.exception.BadRequestException;
import com.teamsync.exception.UnauthorizedException;
import com.teamsync.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private Company testCompany;

    @BeforeEach
    void setUp() {
        testCompany = Company.builder()
                .id("comp-101")
                .name("Test Corp")
                .slug("test-corp")
                .build();

        testUser = User.builder()
                .id("user-101")
                .companyId("comp-101")
                .name("Jane Doe")
                .email("jane@teamsync.space")
                .password("encoded_pass")
                .role("Engineer")
                .department("Engineering")
                .build();
    }

    @Test
    @DisplayName("Register: Successfully creates new user & issues tokens")
    void testRegisterSuccess() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Jane Doe")
                .email("jane@teamsync.space")
                .password("Secret123!")
                .companyName("Test Corp")
                .build();

        when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
        when(companyRepository.findByNameIgnoreCase(anyString())).thenReturn(Optional.of(testCompany));
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(anyString(), anyString(), anyString())).thenReturn("jwt.token.mock");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(new RefreshToken());

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jane@teamsync.space", response.getEmail());
        assertEquals("jwt.token.mock", response.getToken());
        assertNotNull(response.getRefreshToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register: Rejects duplicate email with BadRequestException")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Jane Doe")
                .email("jane@teamsync.space")
                .password("Secret123!")
                .build();

        when(userRepository.existsByEmailIgnoreCase("jane@teamsync.space")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Login: Valid credentials authenticate and return AuthResponse")
    void testLoginSuccess() {
        LoginRequest request = LoginRequest.builder()
                .email("jane@teamsync.space")
                .password("Secret123!")
                .build();

        when(userRepository.findByEmailIgnoreCase("jane@teamsync.space")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("Secret123!", "encoded_pass")).thenReturn(true);
        when(jwtTokenProvider.generateToken(testUser.getId(), testUser.getEmail(), testUser.getCompanyId())).thenReturn("jwt.token.mock");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(new RefreshToken());

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals(testUser.getName(), response.getName());
        assertEquals("jwt.token.mock", response.getToken());
    }

    @Test
    @DisplayName("Login: Invalid password throws UnauthorizedException")
    void testLoginInvalidPassword() {
        LoginRequest request = LoginRequest.builder()
                .email("jane@teamsync.space")
                .password("WrongPassword")
                .build();

        when(userRepository.findByEmailIgnoreCase("jane@teamsync.space")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("WrongPassword", "encoded_pass")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}
