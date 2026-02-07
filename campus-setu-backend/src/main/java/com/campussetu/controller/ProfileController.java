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
// Fixed Update (PATCH) with Null Safety
@PatchMapping("/{id}")
public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
    if (auth == null || !auth.getPrincipal().equals(id)) {
        return ResponseEntity.status(403).build();
    }
    return profileRepository.findById(id).map(profile -> {
        if (body.get("full_name") != null) profile.setFullName((String) body.get("full_name"));
        if (body.get("username") != null) profile.setUsername((String) body.get("username"));
        if (body.get("roll_number") != null) profile.setRollNumber((String) body.get("roll_number"));
        
        // Safety check for numeric cast
        Object year = body.get("year_of_study");
        if (year instanceof Number) {
            profile.setYearOfStudy(((Number) year).intValue());
        }
        
        if (body.get("branch") != null) profile.setBranch((String) body.get("branch"));
        if (body.get("blood_group") != null) profile.setBloodGroup((String) body.get("blood_group"));
        
        profileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }).orElse(ResponseEntity.notFound().build());
}

// Fixed Optional Upsert (Handles Update vs Insert)
@PutMapping("/{id}/optional")
public ResponseEntity<?> upsertOptional(@PathVariable String id, @RequestBody ProfileOptionalEntity optional, Authentication auth) {
    if (auth == null || !auth.getPrincipal().equals(id)) return ResponseEntity.status(403).build();
    
    ProfileEntity p = profileRepository.findById(id).orElse(null);
    if (p == null) return ResponseEntity.notFound().build();
    
    // Logic Fix: Find existing record ID to trigger an UPDATE instead of INSERT
    profileOptionalRepository.findByProfileId(p.getProfileId()).ifPresent(existing -> {
        optional.setOptionalId(existing.getOptionalId());
    });
    
    optional.setProfileId(p.getProfileId());
    return ResponseEntity.ok(profileOptionalRepository.save(optional));
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
