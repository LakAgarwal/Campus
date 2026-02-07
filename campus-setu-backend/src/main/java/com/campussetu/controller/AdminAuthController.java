package com.campussetu.controller;

import com.campussetu.entity.AdminEntity;
import com.campussetu.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin-auth")
public class AdminAuthController {

    private final AdminRepository adminRepository;

    public AdminAuthController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String adminCode = body.get("adminCode");
        String password = body.get("password");
        if (adminCode == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "adminCode and password required"));
        }
        AdminEntity admin = adminRepository.findByAdminCode(adminCode.trim()).orElse(null);
        if (admin == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid admin code"));
        }
        if (!admin.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Incorrect password"));
        }
        return ResponseEntity.ok(Map.of(
                "id", admin.getId(),
                "admin_code", admin.getAdminCode()
        ));
    }
}
