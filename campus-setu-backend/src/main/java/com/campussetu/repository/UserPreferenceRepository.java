package com.campussetu.repository;

import com.campussetu.entity.UserPreferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPreferenceRepository extends JpaRepository<UserPreferenceEntity, Integer> {
    List<UserPreferenceEntity> findByUserId(String userId);
}
