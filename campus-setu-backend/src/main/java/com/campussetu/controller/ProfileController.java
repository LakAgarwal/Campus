package com.campussetu.controller;

import com.campussetu.entity.ProfileEntity;
import com.campussetu.entity.ProfileOptionalEntity;
import com.campussetu.entity.UserPreferenceEntity;
import com.campussetu.repository.ProfileOptionalRepository;
import com.campussetu.repository.ProfileRepository;
import com.campussetu.repository.UserPreferenceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final ProfileOptionalRepository profileOptionalRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public ProfileController(ProfileRepository profileRepository,
                             ProfileOptionalRepository profileOptionalRepository,
                             UserPreferenceRepository userPreferenceRepository) {
        this.profileRepository = profileRepository;
        this.profileOptionalRepository = profileOptionalRepository;
        this.userPreferenceRepository = userPreferenceRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String userId = (String) auth.getPrincipal();
        return profileRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return profileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<?> getByUsername(@PathVariable String username) {
        return profileRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<ProfileEntity> list() {
        return profileRepository.findAll();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        if (auth == null || !auth.getPrincipal().equals(id)) {
            return ResponseEntity.status(403).build();
        }
        return profileRepository.findById(id).map(profile -> {
            if (body.containsKey("full_name")) profile.setFullName((String) body.get("full_name"));
            if (body.containsKey("username")) profile.setUsername((String) body.get("username"));
            if (body.containsKey("roll_number")) profile.setRollNumber((String) body.get("roll_number"));
            if (body.containsKey("year_of_study")) profile.setYearOfStudy(((Number) body.get("year_of_study")).intValue());
            if (body.containsKey("branch")) profile.setBranch((String) body.get("branch"));
            if (body.containsKey("blood_group")) profile.setBloodGroup((String) body.get("blood_group"));
            profileRepository.save(profile);
            return ResponseEntity.ok(profile);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/optional")
    public ResponseEntity<?> getOptional(@PathVariable String id) {
        ProfileEntity p = profileRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        Integer pid = p.getProfileId();
        if (pid == null) return ResponseEntity.ok(List.of());
        List<ProfileOptionalEntity> list = profileOptionalRepository.findByProfileId(pid)
                .map(List::of)
                .orElse(List.of());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/preferences")
    public List<UserPreferenceEntity> getPreferences(@PathVariable String id) {
        return userPreferenceRepository.findByUserId(id);
    }

    @PutMapping("/{id}/optional")
    public ResponseEntity<?> upsertOptional(@PathVariable String id, @RequestBody ProfileOptionalEntity optional, Authentication auth) {
        if (auth == null || !auth.getPrincipal().equals(id)) return ResponseEntity.status(403).build();
        ProfileEntity p = profileRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        Integer profileId = p.getProfileId();
        if (profileId != null) optional.setProfileId(profileId);
        return ResponseEntity.ok(profileOptionalRepository.save(optional));
    }

    @PostMapping("/{id}/preferences")
    public ResponseEntity<?> addPreference(@PathVariable String id, @RequestBody Map<String, String> body, Authentication auth) {
        if (auth == null || !auth.getPrincipal().equals(id)) return ResponseEntity.status(403).build();
        UserPreferenceEntity pref = new UserPreferenceEntity();
        pref.setUserId(id);
        pref.setPreference(body.getOrDefault("preference", ""));
        return ResponseEntity.ok(userPreferenceRepository.save(pref));
    }

    @DeleteMapping("/{id}/preferences/{prefId}")
    public ResponseEntity<Void> deletePreference(@PathVariable String id, @PathVariable Integer prefId, Authentication auth) {
        if (auth == null || !auth.getPrincipal().equals(id)) return ResponseEntity.<Void>status(403).build();
        userPreferenceRepository.deleteById(prefId);
        return ResponseEntity.noContent().build();
    }
}
