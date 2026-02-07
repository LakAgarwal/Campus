package com.campussetu.repository;

import com.campussetu.entity.EventQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventQuestionRepository extends JpaRepository<EventQuestionEntity, Integer> {
    List<EventQuestionEntity> findByEventIdOrderByQuestionId(Integer eventId);
}
