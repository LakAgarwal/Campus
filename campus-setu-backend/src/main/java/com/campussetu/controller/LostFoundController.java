package com.campussetu.controller;

import com.campussetu.entity.FoundItemEntity;
import com.campussetu.entity.LostItemEntity;
import com.campussetu.repository.FoundItemRepository;
import com.campussetu.repository.LostItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lost-found")
public class LostFoundController {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;

    public LostFoundController(LostItemRepository lostItemRepository, FoundItemRepository foundItemRepository) {
        this.lostItemRepository = lostItemRepository;
        this.foundItemRepository = foundItemRepository;
    }

    @GetMapping("/lost")
    public List<LostItemEntity> listLost() {
        return lostItemRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/found")
    public List<FoundItemEntity> listFound() {
        return foundItemRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/lost/user/{userId}")
    public List<LostItemEntity> lostByUser(@PathVariable String userId) {
        return lostItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/found/user/{userId}")
    public List<FoundItemEntity> foundByUser(@PathVariable String userId) {
        return foundItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/lost/{id}")
    public ResponseEntity<LostItemEntity> getLost(@PathVariable Integer id) {
        return lostItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.<LostItemEntity>notFound().build());
    }

    @GetMapping("/found/{id}")
    public ResponseEntity<FoundItemEntity> getFound(@PathVariable Integer id) {
        return foundItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.<FoundItemEntity>notFound().build());
    }

    @PostMapping("/lost")
    public ResponseEntity<LostItemEntity> addLost(@RequestBody LostItemEntity item, Authentication auth) {
        if (auth == null) return ResponseEntity.<LostItemEntity>status(401).build();
        item.setUserId((String) auth.getPrincipal());
        return ResponseEntity.ok(lostItemRepository.save(item));
    }

    @PostMapping("/found")
    public ResponseEntity<FoundItemEntity> addFound(@RequestBody FoundItemEntity item, Authentication auth) {
        if (auth == null) return ResponseEntity.<FoundItemEntity>status(401).build();
        item.setUserId((String) auth.getPrincipal());
        return ResponseEntity.ok(foundItemRepository.save(item));
    }

    @GetMapping("/lost/matches")
    public List<FoundItemEntity> findMatchesForLost(@RequestParam String category) {
        return foundItemRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    @GetMapping("/found/matches")
    public List<LostItemEntity> findMatchesForFound(@RequestParam String category) {
        return lostItemRepository.findByCategoryOrderByCreatedAtDesc(category);
    }
}
