package com.campussetu.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "openings")
public class OpeningEntity {

    @Id
    @Column(name = "opening_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer openingId;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(nullable = false)
    private String title;

    @Column(name = "short_description", nullable = false, columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "long_description", nullable = false, columnDefinition = "TEXT")
    private String longDescription;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String eligibility;

    @Column(nullable = false)
    private String contact;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Integer getOpeningId() { return openingId; }
    public void setOpeningId(Integer openingId) { this.openingId = openingId; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getLongDescription() { return longDescription; }
    public void setLongDescription(String longDescription) { this.longDescription = longDescription; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
