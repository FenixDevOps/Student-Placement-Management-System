package com.placement.system.controller;

import com.placement.system.dto.*;
import com.placement.system.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication Module", description = "Endpoints for student self-registration and universal JWT login")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new Student profile", description = "Checks for unique email, encrypts the password, and creates the Student profile.")
    public ResponseEntity<StudentDto> registerStudent(@Valid @RequestBody RegisterRequest request) {
        StudentDto created = authService.registerStudent(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT token", description = "Accepts username/email and password credentials. Searches both Admin and Student records, returning a JWT token with active roles.")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
