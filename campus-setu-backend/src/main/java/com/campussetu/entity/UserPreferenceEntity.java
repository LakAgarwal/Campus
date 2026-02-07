package com.campussetu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreferenceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String preference;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getPreference() { return preference; }
    public void setPreference(String preference) { this.preference = preference; }
}
