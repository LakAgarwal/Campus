package com.campussetu.repository;

import com.campussetu.entity.FoundItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoundItemRepository extends JpaRepository<FoundItemEntity, Integer> {
    List<FoundItemEntity> findAllByOrderByCreatedAtDesc();
    List<FoundItemEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    List<FoundItemEntity> findByCategoryOrderByCreatedAtDesc(String category);
}
