package com.campussetu.repository;

import com.campussetu.entity.EventRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistrationEntity, Integer> {
    List<EventRegistrationEntity> findByUserId(String userId);
    List<EventRegistrationEntity> findByEventId(Integer eventId);
    Optional<EventRegistrationEntity> findByEventIdAndUserId(Integer eventId, String userId);
    boolean existsByEventIdAndUserId(Integer eventId, String userId);
}
