package com.campussetu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profile_optional")
public class ProfileOptionalEntity {

    @Id
    @Column(name = "optional_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer optionalId;

    @Column(name = "profile_id", nullable = false)
    private Integer profileId;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "social_media_links", columnDefinition = "TEXT")
    private String socialMediaLinks;

    @Column(name = "volunteering_exp", columnDefinition = "TEXT")
    private String volunteeringExp;

    public Integer getOptionalId() { return optionalId; }
    public void setOptionalId(Integer optionalId) { this.optionalId = optionalId; }
    public Integer getProfileId() { return profileId; }
    public void setProfileId(Integer profileId) { this.profileId = profileId; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getSocialMediaLinks() { return socialMediaLinks; }
    public void setSocialMediaLinks(String socialMediaLinks) { this.socialMediaLinks = socialMediaLinks; }
    public String getVolunteeringExp() { return volunteeringExp; }
    public void setVolunteeringExp(String volunteeringExp) { this.volunteeringExp = volunteeringExp; }
}
