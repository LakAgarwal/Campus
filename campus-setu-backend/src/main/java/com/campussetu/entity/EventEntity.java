package com.campussetu.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "events")
public class EventEntity {

    @Id
    @Column(name = "event_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer eventId;

    @Column(name = "club_id", nullable = false)
    private Integer clubId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String datetime;

    @Column(nullable = false)
    private String location;

    @Column(name = "short_description", nullable = false, columnDefinition = "TEXT")
    private String shortDescription;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String eligibility;

    @Column(name = "event_type")
    private String eventType = "open";

    @Column(name = "event_status")
    private String status = "Open";

    @Column(name = "registration_deadline")
    private String registrationDeadline;

    @Column(name = "max_attendees")
    private Integer maxAttendees;

    @Column(name = "current_attendees")
    private Integer currentAttendees = 0;

    @Column(name = "event_thumbnail")
    private String eventThumbnail;

    @Column(name = "payment_link")
    private String paymentLink;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @Column(name = "is_valid")
    private String isValid;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }
    public Integer getClubId() { return clubId; }
    public void setClubId(Integer clubId) { this.clubId = clubId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDatetime() { return datetime; }
    public void setDatetime(String datetime) { this.datetime = datetime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(String registrationDeadline) { this.registrationDeadline = registrationDeadline; }
    public Integer getMaxAttendees() { return maxAttendees; }
    public void setMaxAttendees(Integer maxAttendees) { this.maxAttendees = maxAttendees; }
    public Integer getCurrentAttendees() { return currentAttendees; }
    public void setCurrentAttendees(Integer currentAttendees) { this.currentAttendees = currentAttendees; }
    public String getEventThumbnail() { return eventThumbnail; }
    public void setEventThumbnail(String eventThumbnail) { this.eventThumbnail = eventThumbnail; }
    public String getPaymentLink() { return paymentLink; }
    public void setPaymentLink(String paymentLink) { this.paymentLink = paymentLink; }
    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
    public String getIsValid() { return isValid; }
    public void setIsValid(String isValid) { this.isValid = isValid; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
