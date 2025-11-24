package com.example.demo.service.auth;

import com.example.demo.dtos.GetUserDTO;
import com.example.demo.dtos.auth.LoginRequestDto;
import com.example.demo.dtos.auth.LoginResponseDto;
import com.example.demo.entity.User;
import com.example.demo.exceptions.UserNotFoundException;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    public LoginResponseDto login(LoginRequestDto dto) throws Exception {

        // 1. Find user by email
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Email not registered"));

        // 2. Check password
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }


        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),            // username/email for JWT
                user.getPassword(),         // password
                Collections.emptyList()     // authorities
        );

        // 4. Generate JWT with userId claim
        String token = jwtService.generateToken(userDetails, user.getId());

        // 5. Convert user to DTO used by mobile app
        GetUserDTO userDto = userService.getUserById(user.getId());

        // 6. Build response
        return new LoginResponseDto(token, userDto);
    }

    public GetUserDTO getAuthenticatedUser(String token) throws Exception {
        // Extract userId directly from JWT
        Long userId = jwtService.getAuthenticatedUserId(token);
        return userService.getUserById(userId);
    }
}
