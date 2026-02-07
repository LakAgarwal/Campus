package com.campussetu.repository;

import com.campussetu.entity.EventStudentResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventStudentResponseRepository extends JpaRepository<EventStudentResponseEntity, Integer> {
    List<EventStudentResponseEntity> findByUserIdAndQuestionIdIn(String userId, List<Integer> questionIds);
}
