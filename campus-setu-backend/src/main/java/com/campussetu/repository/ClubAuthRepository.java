package com.campussetu.repository;

import com.campussetu.entity.ClubAuthEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ClubAuthRepository extends JpaRepository<ClubAuthEntity, Integer> {
    Optional<ClubAuthEntity> findByClubCode(String clubCode);

    @Query("SELECT ca FROM ClubAuthEntity ca JOIN FETCH ca.club WHERE ca.clubCode = :clubCode")
    Optional<ClubAuthEntity> findByClubCodeWithClub(String clubCode);

    java.util.List<ClubAuthEntity> findByStatus(String status);
}
