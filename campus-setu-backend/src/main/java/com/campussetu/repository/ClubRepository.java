package com.campussetu.repository;

import com.campussetu.entity.ClubEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<ClubEntity, Integer> {
}
