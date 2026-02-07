package com.campussetu.controller;

import com.campussetu.entity.UserEntity;
import com.campussetu.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}/email")
    public ResponseEntity<?> getEmail(@PathVariable String id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(Map.of("email", u.getEmail())))
                .orElse(ResponseEntity.notFound().build());
    }
}
