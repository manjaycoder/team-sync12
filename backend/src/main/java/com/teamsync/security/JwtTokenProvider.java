package com.teamsync.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${teamsync.jwt.secret:teamsync_jwt_super_secret_key_2026_production_ready_enterprise_level_hmac256_key}")
    private String jwtSecret;

    @Value("${teamsync.jwt.expiration-ms:604800000}") // 7 days default
    private long jwtExpirationInMs;

    private SecretKey key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            // Pad to at least 32 bytes for HMAC-SHA256 safety
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            key = Keys.hmacShaKeyFor(padded);
        } else {
            key = Keys.hmacShaKeyFor(keyBytes);
        }
    }

    public String generateToken(String userId, String email, String companyId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(userId)
                .claim("id", userId)
                .claim("email", email)
                .claim("companyId", companyId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = getClaims(token);
        String sub = claims.getSubject();
        if (sub != null && !sub.isEmpty()) {
            return sub;
        }
        return claims.get("id", String.class);
    }

    public String getEmailFromToken(String token) {
        return getClaims(token).get("email", String.class);
    }

    public String getCompanyIdFromToken(String token) {
        return getClaims(token).get("companyId", String.class);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.warn("Invalid or expired JWT token: {}", ex.getMessage());
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

