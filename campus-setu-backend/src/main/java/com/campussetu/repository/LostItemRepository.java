package com.campussetu.repository;

import com.campussetu.entity.LostItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItemEntity, Integer> {
    List<LostItemEntity> findAllByOrderByCreatedAtDesc();
    List<LostItemEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    List<LostItemEntity> findByCategoryOrderByCreatedAtDesc(String category);
}
