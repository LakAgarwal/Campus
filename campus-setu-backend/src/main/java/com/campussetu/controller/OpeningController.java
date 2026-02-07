package com.campussetu.controller;

import com.campussetu.entity.OpeningEntity;
import com.campussetu.entity.OpeningMemberEntity;
import com.campussetu.repository.OpeningMemberRepository;
import com.campussetu.repository.OpeningRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/openings")
public class OpeningController {

    private final OpeningRepository openingRepository;
    private final OpeningMemberRepository openingMemberRepository;

    public OpeningController(OpeningRepository openingRepository, OpeningMemberRepository openingMemberRepository) {
        this.openingRepository = openingRepository;
        this.openingMemberRepository = openingMemberRepository;
    }

    @GetMapping
    public List<OpeningEntity> list() {
        return openingRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpeningEntity> getById(@PathVariable Integer id) {
        return openingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    public List<OpeningEntity> myOpenings(Authentication auth) {
        if (auth == null) return List.of();
        return openingRepository.findByCreatedByOrderByCreatedAtDesc((String) auth.getPrincipal());
    }

    @GetMapping("/{openingId}/members")
    public List<OpeningMemberEntity> getMembers(@PathVariable Integer openingId) {
        return openingMemberRepository.findByOpeningId(openingId);
    }

    @PostMapping("/{openingId}/join")
    public ResponseEntity<?> join(@PathVariable Integer openingId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String userId = (String) auth.getPrincipal();
        if (openingMemberRepository.existsByOpeningIdAndUserId(openingId, userId)) {
            return ResponseEntity.badRequest().body("Already a member");
        }
        OpeningMemberEntity member = new OpeningMemberEntity();
        member.setOpeningId(openingId);
        member.setUserId(userId);
        return ResponseEntity.ok(openingMemberRepository.save(member));
    }

    @PostMapping
    public ResponseEntity<OpeningEntity> create(@RequestBody OpeningEntity opening, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        opening.setCreatedBy((String) auth.getPrincipal());
        return ResponseEntity.ok(openingRepository.save(opening));
    }
}
