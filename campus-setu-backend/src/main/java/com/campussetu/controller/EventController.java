package com.campussetu.controller;

import com.campussetu.entity.EventEntity;
import com.campussetu.entity.EventQuestionEntity;
import com.campussetu.entity.EventRegistrationEntity;
import com.campussetu.entity.EventStudentResponseEntity;
import com.campussetu.repository.EventQuestionRepository;
import com.campussetu.repository.EventRegistrationRepository;
import com.campussetu.repository.EventRepository;
import com.campussetu.repository.EventStudentResponseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventQuestionRepository eventQuestionRepository;
    private final EventStudentResponseRepository eventStudentResponseRepository;

    public EventController(EventRepository eventRepository, EventRegistrationRepository eventRegistrationRepository,
                           EventQuestionRepository eventQuestionRepository, EventStudentResponseRepository eventStudentResponseRepository) {
        this.eventRepository = eventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.eventQuestionRepository = eventQuestionRepository;
        this.eventStudentResponseRepository = eventStudentResponseRepository;
    }

    @GetMapping("/{eventId}/questions")
    public List<EventQuestionEntity> getQuestions(@PathVariable Integer eventId) {
        return eventQuestionRepository.findByEventIdOrderByQuestionId(eventId);
    }

    @PostMapping("/{eventId}/questions")
    public ResponseEntity<?> addQuestions(@PathVariable Integer eventId, @RequestBody List<Map<String, String>> body) {
        for (Map<String, String> q : body) {
            EventQuestionEntity eq = new EventQuestionEntity();
            eq.setEventId(eventId);
            eq.setQuestion(q.getOrDefault("question", ""));
            eventQuestionRepository.save(eq);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<EventEntity> list(@RequestParam(required = false) Integer clubId) {
        if (clubId != null) {
            return eventRepository.findByClubIdOrderByDatetimeDesc(clubId);
        }
        return eventRepository.findByIsDeletedFalseOrderByDatetimeAsc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventEntity> getById(@PathVariable Integer id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EventEntity> update(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        return eventRepository.findById(id)
                .map(e -> {
                    if (body.containsKey("status")) e.setStatus((String) body.get("status"));
                    if (body.containsKey("isDeleted")) e.setIsDeleted((Boolean) body.get("isDeleted"));
                    return ResponseEntity.ok(eventRepository.save(e));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EventEntity> create(@RequestBody Map<String, Object> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        EventEntity e = new EventEntity();
        if (body.get("clubId") != null) e.setClubId(((Number) body.get("clubId")).intValue());
        if (body.get("name") != null) e.setName((String) body.get("name"));
        if (body.get("datetime") != null) e.setDatetime((String) body.get("datetime"));
        if (body.get("location") != null) e.setLocation((String) body.get("location"));
        if (body.get("shortDescription") != null) e.setShortDescription((String) body.get("shortDescription"));
        if (body.get("eligibility") != null) e.setEligibility((String) body.get("eligibility"));
        if (body.get("registrationDeadline") != null) e.setRegistrationDeadline((String) body.get("registrationDeadline"));
        if (body.get("status") != null) e.setStatus((String) body.get("status"));
        if (body.get("maxAttendees") != null) e.setMaxAttendees(((Number) body.get("maxAttendees")).intValue());
        if (body.get("eventThumbnail") != null) e.setEventThumbnail((String) body.get("eventThumbnail"));
        if (body.get("eventType") != null) e.setEventType((String) body.get("eventType"));
        if (body.get("paymentLink") != null) e.setPaymentLink((String) body.get("paymentLink"));
        e.setCurrentAttendees(0);
        e.setIsDeleted(false);
        return ResponseEntity.ok(eventRepository.save(e));
    }

    @GetMapping("/{eventId}/registrations")
    public List<EventRegistrationEntity> getRegistrations(@PathVariable Integer eventId) {
        return eventRegistrationRepository.findByEventId(eventId);
    }

    @GetMapping("/my-registrations")
    public List<EventRegistrationEntity> myRegistrations(Authentication auth) {
        if (auth == null) return List.of();
        return eventRegistrationRepository.findByUserId((String) auth.getPrincipal());
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<?> register(@PathVariable Integer eventId, @RequestBody(required = false) Map<String, Object> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String userId = (String) auth.getPrincipal();
        if (eventRegistrationRepository.existsByEventIdAndUserId(eventId, userId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Already registered"));
        }
        EventRegistrationEntity reg = new EventRegistrationEntity();
        reg.setEventId(eventId);
        reg.setUserId(userId);
        reg.setStatus("pending");
        if (body != null) {
            if (body.containsKey("event_type")) reg.setEventType(String.valueOf(body.get("event_type")));
            if (body.containsKey("payment_proof")) reg.setPaymentProof(body.get("payment_proof") != null ? String.valueOf(body.get("payment_proof")) : null);
            if (body.containsKey("qr_code")) reg.setQrCode(body.get("qr_code") != null ? String.valueOf(body.get("qr_code")) : null);
        }
        reg = eventRegistrationRepository.save(reg);

        if (body != null && body.containsKey("answers") && body.get("answers") instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> answers = (Map<String, Object>) body.get("answers");
            for (Map.Entry<String, Object> e : answers.entrySet()) {
                try {
                    int questionId = Integer.parseInt(e.getKey());
                    EventStudentResponseEntity resp = new EventStudentResponseEntity();
                    resp.setUserId(userId);
                    resp.setQuestionId(questionId);
                    resp.setResponse(e.getValue() != null ? String.valueOf(e.getValue()) : "");
                    eventStudentResponseRepository.save(resp);
                } catch (NumberFormatException ignored) {}
            }
        }
        return ResponseEntity.ok(reg);
    }
}
