package com.campussetu.controller;

import com.campussetu.entity.ConnectionEntity;
import com.campussetu.repository.ConnectionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/connections")
public class ConnectionController {

    private final ConnectionRepository connectionRepository;

    public ConnectionController(ConnectionRepository connectionRepository) {
        this.connectionRepository = connectionRepository;
    }

    @GetMapping
    public List<ConnectionEntity> list(Authentication auth) {
        if (auth == null) return List.of();
        String userId = (String) auth.getPrincipal();
        return connectionRepository.findByUser1IdOrUser2Id(userId, userId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String user1Id = body.get("user1_id");
        String user2Id = body.get("user2_id");
        if (user1Id == null || user2Id == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "user1_id and user2_id required"));
        }
        if (!user1Id.equals(auth.getPrincipal())) {
            return ResponseEntity.status(403).build();
        }
        ConnectionEntity conn = new ConnectionEntity();
        conn.setUser1Id(user1Id);
        conn.setUser2Id(user2Id);
        conn.setStatus("pending");
        return ResponseEntity.ok(connectionRepository.save(conn));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Map<String, String> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return connectionRepository.findById(id)
                .filter(c -> c.getUser2Id().equals(auth.getPrincipal()) || c.getUser1Id().equals(auth.getPrincipal()))
                .map(c -> {
                    if (body.containsKey("status")) c.setStatus(body.get("status"));
                    return ResponseEntity.ok(connectionRepository.save(c));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return connectionRepository.findById(id)
                .filter(c -> c.getUser1Id().equals(auth.getPrincipal()) || c.getUser2Id().equals(auth.getPrincipal()))
                .map(c -> {
                    connectionRepository.delete(c);
                    return ResponseEntity.<Void>noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
