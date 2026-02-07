package com.campussetu.controller;

import com.campussetu.entity.VolunteeringEventEntity;
import com.campussetu.repository.VolunteeringEventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/volunteering-events")
public class VolunteeringEventController {

    private final VolunteeringEventRepository repository;

    public VolunteeringEventController(VolunteeringEventRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<VolunteeringEventEntity> list() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<VolunteeringEventEntity> create(@RequestBody VolunteeringEventEntity event, Authentication auth) {
        if (auth != null) {
            event.setOrganizedBy((String) auth.getPrincipal());
        }
        return ResponseEntity.ok(repository.save(event));
    }
}
