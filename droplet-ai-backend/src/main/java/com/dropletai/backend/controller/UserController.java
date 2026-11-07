
package com.dropletai.backend.controller;

import com.dropletai.backend.entity.User;
import com.dropletai.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Authentication successful");
        response.put("email", email);
        if (user != null) {
            response.put("id", user.getId());
            response.put("fullName", user.getFullName());
        }

        return ResponseEntity.ok(response);
    }
}
