package com.example.demo.dtos;


import com.example.demo.enums.AccountTypes;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
@AllArgsConstructor
public class CreateUserDto {

    private String fullName;

    @Email
    private String email;


    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\\d.*\\d).{8,}$",
            message = "Use a strong password which contains at least:\n" +
                    "- 8 characters\n" +
                    "- one uppercase letter\n" +
                    "- two numbers\n" +
                    "- one special character (! @ # $ & *)")
    private String password;


    private AccountTypes accountType;


    public CreateUserDto() {

    }
}
