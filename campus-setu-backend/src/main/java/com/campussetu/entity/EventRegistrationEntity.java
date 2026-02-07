package com.campussetu.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "event_registrations")
public class EventRegistrationEntity {

    @Id
    @Column(name = "registration_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer registrationId;

    @Column(name = "event_id", nullable = false)
    private Integer eventId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "event_type", nullable = false)
    private String eventType = "open";

    @Column(nullable = false)
    private String status = "pending";

    @Column(name = "payment_proof")
    private String paymentProof;

    @Column(name = "qr_code")
    private String qrCode;

    @Column(name = "is_valid")
    private String isValid;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @PrePersist
    public void prePersist() {
        if (submittedAt == null) submittedAt = Instant.now();
    }

    public Integer getRegistrationId() { return registrationId; }
    public void setRegistrationId(Integer registrationId) { this.registrationId = registrationId; }
    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentProof() { return paymentProof; }
    public void setPaymentProof(String paymentProof) { this.paymentProof = paymentProof; }
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    public String getIsValid() { return isValid; }
    public void setIsValid(String isValid) { this.isValid = isValid; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
