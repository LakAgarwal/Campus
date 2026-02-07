package com.campussetu.repository;

import com.campussetu.entity.OpeningMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OpeningMemberRepository extends JpaRepository<OpeningMemberEntity, Integer> {
    List<OpeningMemberEntity> findByOpeningId(Integer openingId);
    List<OpeningMemberEntity> findByUserId(String userId);
    Optional<OpeningMemberEntity> findByOpeningIdAndUserId(Integer openingId, String userId);
    boolean existsByOpeningIdAndUserId(Integer openingId, String userId);
}
