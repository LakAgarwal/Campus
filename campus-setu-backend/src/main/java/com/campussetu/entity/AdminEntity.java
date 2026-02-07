package com.campussetu.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "admin")
public class AdminEntity {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "admin_code", nullable = false, unique = true)
    private String adminCode;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAdminCode() { return adminCode; }
    public void setAdminCode(String adminCode) { this.adminCode = adminCode; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
