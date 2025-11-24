package com.example.demo.controller;

import com.example.demo.dtos.GetUserDTO;
import com.example.demo.dtos.auth.LoginRequestDto;
import com.example.demo.dtos.auth.LoginResponseDto;
import com.example.demo.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto dto) throws Exception {
        LoginResponseDto response = authService.login(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<GetUserDTO> getProfile(@RequestHeader("Authorization") String authHeader) throws Exception {
        // Extract JWT token from "Bearer <token>"
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        String token = authHeader.replace("Bearer ", "");

        GetUserDTO userDto = authService.getAuthenticatedUser(token);
        return ResponseEntity.ok(userDto);
    }
}
