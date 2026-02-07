package com.campussetu.repository;

import com.campussetu.entity.OpeningEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpeningRepository extends JpaRepository<OpeningEntity, Integer> {
    List<OpeningEntity> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    List<OpeningEntity> findAllByOrderByCreatedAtDesc();
}
