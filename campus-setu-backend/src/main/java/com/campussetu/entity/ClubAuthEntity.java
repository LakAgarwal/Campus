package com.campussetu.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "club_auth")
public class ClubAuthEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "club_code", nullable = false, unique = true)
    private String clubCode;

    @Column(name = "club_id", nullable = false)
    private Integer clubId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String status = "Pending";

    @Column(name = "created_at")
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", insertable = false, updatable = false)
    private ClubEntity club;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getClubCode() { return clubCode; }
    public void setClubCode(String clubCode) { this.clubCode = clubCode; }
    public Integer getClubId() { return clubId; }
    public void setClubId(Integer clubId) { this.clubId = clubId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public ClubEntity getClub() { return club; }
    public void setClub(ClubEntity club) { this.club = club; }
}
