package com.campussetu.repository;

import com.campussetu.entity.ProfileOptionalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileOptionalRepository extends JpaRepository<ProfileOptionalEntity, Integer> {
    Optional<ProfileOptionalEntity> findByProfileId(Integer profileId);
}
