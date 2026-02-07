package com.campussetu.controller;

import com.campussetu.entity.ClubAuthEntity;
import com.campussetu.entity.ClubEntity;
import com.campussetu.repository.ClubAuthRepository;
import com.campussetu.repository.ClubRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/clubs")
public class ClubController {

    private final ClubRepository clubRepository;
    private final ClubAuthRepository clubAuthRepository;

    public ClubController(ClubRepository clubRepository, ClubAuthRepository clubAuthRepository) {
        this.clubRepository = clubRepository;
        this.clubAuthRepository = clubAuthRepository;
    }

    @GetMapping
    public List<ClubEntity> list() {
        return clubRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubEntity> getById(@PathVariable Integer id) {
        return clubRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.<ClubEntity>notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String adminId = (String) auth.getPrincipal();
        String name = (String) body.get("name");
        String description = body.containsKey("description") ? (String) body.get("description") : null;
        String category = (String) body.get("category");
        String password = (String) body.get("password");
        if (name == null || category == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "name, category, password required"));
        }
        if (clubRepository.findAll().stream().anyMatch(c -> name.equals(c.getName()))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Club name already exists"));
        }
        ClubEntity club = new ClubEntity();
        club.setName(name);
        club.setCategory(category);
        club.setAdminId(adminId);
        club.setDescription(description);
        club = clubRepository.save(club);

        String clubCode = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        while (clubAuthRepository.findByClubCode(clubCode).isPresent()) {
            clubCode = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        }
        ClubAuthEntity clubAuth = new ClubAuthEntity();
        clubAuth.setClubId(club.getClubId());
        clubAuth.setClubCode(clubCode);
        clubAuth.setPassword(password);
        clubAuth.setStatus("Approved");
        clubAuthRepository.save(clubAuth);

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("club", club);
        result.put("club_code", clubCode);
        result.put("club_id", club.getClubId());
        return ResponseEntity.ok(result);
    }
}
