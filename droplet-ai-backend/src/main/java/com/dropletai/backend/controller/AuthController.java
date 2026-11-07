
package com.dropletai.backend.controller;

import com.dropletai.backend.dto.AuthResponse;
import com.dropletai.backend.dto.SignupRequest;
import com.dropletai.backend.dto.LoginRequest;
import com.dropletai.backend.dto.FirebaseTokenRequest;
import com.dropletai.backend.service.FirebaseAuthService;
import com.dropletai.backend.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final FirebaseAuthService firebaseAuthService;

    public AuthController(AuthService authService, FirebaseAuthService firebaseAuthService) {
        this.authService = authService;
        this.firebaseAuthService = firebaseAuthService;
    }

    // SIGNUP API
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }

    // LOGIN API
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/firebase")
    public ResponseEntity<AuthResponse> firebaseSignIn(
            @Valid @RequestBody FirebaseTokenRequest request
    ) {
        return ResponseEntity.ok(firebaseAuthService.signIn(request));
    }
}
