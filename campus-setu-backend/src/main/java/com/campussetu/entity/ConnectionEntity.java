package com.campussetu.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_connections")
public class ConnectionEntity {

    @Id
    @Column(name = "connection_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer connectionId;

    @Column(name = "user1_id", nullable = false)
    private String user1Id;

    @Column(name = "user2_id", nullable = false)
    private String user2Id;

    @Column(nullable = false)
    private String status = "pending";

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Integer getConnectionId() { return connectionId; }
    public void setConnectionId(Integer connectionId) { this.connectionId = connectionId; }
    public String getUser1Id() { return user1Id; }
    public void setUser1Id(String user1Id) { this.user1Id = user1Id; }
    public String getUser2Id() { return user2Id; }
    public void setUser2Id(String user2Id) { this.user2Id = user2Id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
