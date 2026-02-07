package com.campussetu.controller;

import com.campussetu.entity.ClubAuthEntity;
import com.campussetu.entity.ClubEntity;
import com.campussetu.repository.ClubAuthRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/club-auth")
public class ClubAuthController {

    private final ClubAuthRepository clubAuthRepository;

    public ClubAuthController(ClubAuthRepository clubAuthRepository) {
        this.clubAuthRepository = clubAuthRepository;
    }

    @GetMapping
    public java.util.List<ClubAuthEntity> list(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return clubAuthRepository.findByStatus(status);
        }
        return clubAuthRepository.findAll();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String clubCode = body.get("clubCode");
        String password = body.get("password");
        if (clubCode == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "clubCode and password required"));
        }
        String trimmedCode = clubCode.trim().toUpperCase();
        ClubAuthEntity auth = clubAuthRepository.findByClubCodeWithClub(trimmedCode)
                .orElse(null);
        if (auth == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid club code"));
        }
        if (!"Approved".equals(auth.getStatus())) {
            return ResponseEntity.status(403).body(Map.of("error", "Club not approved"));
        }
        if (!auth.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Incorrect password"));
        }
        ClubEntity club = auth.getClub();
        Map<String, Object> data = new HashMap<>();
        data.put("club_id", auth.getClubId());
        data.put("clubs", Map.of(
                "name", club.getName(),
                "category", club.getCategory(),
                "admin_id", club.getAdminId()
        ));
        data.put("status", auth.getStatus());
        return ResponseEntity.ok(data);
    }
}
