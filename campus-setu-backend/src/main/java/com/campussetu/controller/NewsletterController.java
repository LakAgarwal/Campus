package com.campussetu.controller;

import com.campussetu.entity.AlertNewsletterEntity;
import com.campussetu.repository.AlertNewsletterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/newsletters")
public class NewsletterController {

    private final AlertNewsletterRepository newsletterRepository;

    public NewsletterController(AlertNewsletterRepository newsletterRepository) {
        this.newsletterRepository = newsletterRepository;
    }

    @GetMapping
    public List<AlertNewsletterEntity> list() {
        return newsletterRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<AlertNewsletterEntity> create(@RequestBody AlertNewsletterEntity newsletter) {
        return ResponseEntity.ok(newsletterRepository.save(newsletter));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        newsletterRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
