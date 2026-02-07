package com.campussetu.controller;

import com.campussetu.dto.AuthRequest;
import com.campussetu.dto.AuthResponse;
import com.campussetu.dto.RegisterRequest;
import com.campussetu.entity.ProfileEntity;
import com.campussetu.repository.ProfileRepository;
import com.campussetu.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final ProfileRepository profileRepository;

    public AuthController(AuthService authService, ProfileRepository profileRepository) {
        this.authService = authService;
        this.profileRepository = profileRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("session", (Object) null));
        }
        String userId = (String) authentication.getPrincipal();
        ProfileEntity profile = profileRepository.findById(userId).orElse(null);
        Map<String, Object> user = new java.util.HashMap<>();
        user.put("id", userId);
        user.put("email", profile != null ? "" : "");
        Map<String, Object> session = new java.util.HashMap<>();
        session.put("user", user);
        session.put("access_token", "");
        return ResponseEntity.ok(Map.of("session", session));
    }
}
