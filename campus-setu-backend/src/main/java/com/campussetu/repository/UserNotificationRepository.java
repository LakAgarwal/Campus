package com.campussetu.repository;

import com.campussetu.entity.UserNotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserNotificationRepository extends JpaRepository<UserNotificationEntity, Integer> {
    List<UserNotificationEntity> findByUserIdOrderByCreatedAtDesc(String userId);
}
