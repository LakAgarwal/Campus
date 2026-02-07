package com.campussetu.service;

import com.campussetu.dto.AuthRequest;
import com.campussetu.dto.AuthResponse;
import com.campussetu.dto.RegisterRequest;
import com.campussetu.entity.ProfileEntity;
import com.campussetu.entity.UserEntity;
import com.campussetu.repository.ProfileRepository;
import com.campussetu.repository.UserRepository;
import com.campussetu.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, ProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (profileRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        String userId = UUID.randomUUID().toString();
        UserEntity user = new UserEntity();
        user.setId(userId);
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);

        int nextProfileId = (int) (profileRepository.count() + 1);
        ProfileEntity profile = new ProfileEntity();
        profile.setId(userId);
        profile.setProfileId(nextProfileId);
        profile.setFullName(req.getFullName());
        profile.setUsername(req.getUsername());
        profile.setRollNumber(req.getRollNumber());
        profile.setYearOfStudy(req.getYearOfStudy());
        profile.setBranch(req.getBranch());
        profile.setBloodGroup(req.getBloodGroup());
        profileRepository.save(profile);

        String token = jwtUtil.generateToken(userId, req.getEmail());
        AuthResponse res = new AuthResponse();
        res.setAccessToken(token);
        res.setUserId(userId);
        res.setEmail(req.getEmail());
        AuthResponse.UserData userData = new AuthResponse.UserData();
        userData.setId(userId);
        userData.setEmail(req.getEmail());
        res.setUser(userData);
        return res;
    }

    public AuthResponse login(AuthRequest req) {
        UserEntity user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        AuthResponse res = new AuthResponse();
        res.setAccessToken(token);
        res.setUserId(user.getId());
        res.setEmail(user.getEmail());
        AuthResponse.UserData userData = new AuthResponse.UserData();
        userData.setId(user.getId());
        userData.setEmail(user.getEmail());
        res.setUser(userData);
        return res;
    }
}
