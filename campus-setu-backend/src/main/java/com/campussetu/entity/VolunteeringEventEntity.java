package com.campussetu.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "volunteering_events")
public class VolunteeringEventEntity {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date", nullable = false)
    private String eventDate;

    @Column(nullable = false)
    private String location;

    @Column(name = "organized_by")
    private String organizedBy;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "emergency_flag")
    private Boolean emergencyFlag;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        if (id == null) id = java.util.UUID.randomUUID().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getOrganizedBy() { return organizedBy; }
    public void setOrganizedBy(String organizedBy) { this.organizedBy = organizedBy; }
    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public Boolean getEmergencyFlag() { return emergencyFlag; }
    public void setEmergencyFlag(Boolean emergencyFlag) { this.emergencyFlag = emergencyFlag; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
