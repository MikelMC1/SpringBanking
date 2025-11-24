package com.example.demo.dtos.auth;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LoginRequestDto {

    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
