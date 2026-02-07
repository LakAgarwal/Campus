package com.campussetu.controller;

import com.campussetu.entity.UserNotificationEntity;
import com.campussetu.repository.UserNotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final UserNotificationRepository notificationRepository;

    public NotificationController(UserNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<UserNotificationEntity> list(@RequestParam(required = false) String userId, Authentication auth) {
        String uid = userId != null ? userId : (auth != null ? (String) auth.getPrincipal() : null);
        if (uid == null) return List.of();
        if (auth != null && !uid.equals(auth.getPrincipal())) return List.of();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(uid);
    }

    @PatchMapping("/mark-read")
    public ResponseEntity<Void> markAllRead(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String uid = (String) auth.getPrincipal();
        List<UserNotificationEntity> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(uid);
        for (UserNotificationEntity n : list) {
            if (!Boolean.TRUE.equals(n.getRead())) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        }
        return ResponseEntity.noContent().build();
    }
}
