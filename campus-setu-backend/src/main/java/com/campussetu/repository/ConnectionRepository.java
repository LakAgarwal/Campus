package com.campussetu.repository;

import com.campussetu.entity.ConnectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConnectionRepository extends JpaRepository<ConnectionEntity, Integer> {
    List<ConnectionEntity> findByUser1IdOrUser2Id(String user1Id, String user2Id);
}
