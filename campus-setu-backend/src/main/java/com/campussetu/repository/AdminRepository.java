package com.campussetu.repository;

import com.campussetu.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<AdminEntity, String> {
    Optional<AdminEntity> findByAdminCode(String adminCode);
}
