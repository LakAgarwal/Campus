package com.campussetu.repository;

import com.campussetu.entity.AlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<AlertEntity, Integer> {
    List<AlertEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    void deleteByUserId(String userId);
}
