package com.campussetu.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "resources")
public class ResourceEntity {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String link;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String tags;

    @Column(name = "posted_by_type", nullable = false)
    private String postedByType;

    @Column(name = "posted_by_user")
    private String postedByUser;

    @Column(name = "posted_by_admin")
    private String postedByAdmin;

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
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getPostedByType() { return postedByType; }
    public void setPostedByType(String postedByType) { this.postedByType = postedByType; }
    public String getPostedByUser() { return postedByUser; }
    public void setPostedByUser(String postedByUser) { this.postedByUser = postedByUser; }
    public String getPostedByAdmin() { return postedByAdmin; }
    public void setPostedByAdmin(String postedByAdmin) { this.postedByAdmin = postedByAdmin; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
