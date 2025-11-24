package com.example.demo.dtos.auth;

import com.example.demo.dtos.GetUserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String token;
    private GetUserDTO user;
}
