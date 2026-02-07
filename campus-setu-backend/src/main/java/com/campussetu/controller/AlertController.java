package com.campussetu.controller;

import com.campussetu.entity.AlertEntity;
import com.campussetu.repository.AlertRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    private final AlertRepository alertRepository;

    public AlertController(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @GetMapping
    public List<AlertEntity> list(@RequestParam(required = false) String userId, Authentication auth) {
        if (auth == null) return List.of();
        String uid = userId != null ? userId : (String) auth.getPrincipal();
        if (!uid.equals(auth.getPrincipal())) return List.of();
        return alertRepository.findByUserIdOrderByCreatedAtDesc(uid);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody List<Map<String, String>> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String uid = (String) auth.getPrincipal();
        for (Map<String, String> a : body) {
            AlertEntity e = new AlertEntity();
            e.setUserId(uid);
            e.setHeading(a.getOrDefault("heading", ""));
            e.setContent(a.getOrDefault("content", ""));
            e.setTime(a.getOrDefault("time", ""));
            alertRepository.save(e);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteByUser(@RequestParam String userId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        if (!userId.equals(auth.getPrincipal())) return ResponseEntity.status(403).build();
        alertRepository.deleteByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}
