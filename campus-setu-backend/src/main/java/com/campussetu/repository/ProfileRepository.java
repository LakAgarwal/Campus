package com.campussetu.repository;

import com.campussetu.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity, String> {
    Optional<ProfileEntity> findByUsername(String username);
    boolean existsByUsername(String username);
}
