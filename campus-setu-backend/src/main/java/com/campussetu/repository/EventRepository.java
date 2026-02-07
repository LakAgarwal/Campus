package com.campussetu.repository;

import com.campussetu.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<EventEntity, Integer> {
    List<EventEntity> findByClubIdOrderByDatetimeDesc(Integer clubId);
    List<EventEntity> findByIsDeletedFalseOrderByDatetimeAsc();
}
