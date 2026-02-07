package com.campussetu.controller;

import com.campussetu.entity.ResourceEntity;
import com.campussetu.repository.ResourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resources")
public class ResourceController {

    private final ResourceRepository resourceRepository;

    public ResourceController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @GetMapping
    public List<ResourceEntity> list() {
        return resourceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceEntity> getById(@PathVariable String id) {
        return resourceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ResourceEntity> create(@RequestBody ResourceEntity resource, Authentication auth) {
        if (auth != null) {
            resource.setPostedByType("user");
            resource.setPostedByUser((String) auth.getPrincipal());
        }
        return ResponseEntity.ok(resourceRepository.save(resource));
    }
}
