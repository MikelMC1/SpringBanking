package com.example.demo.mapper;

import com.example.demo.dtos.CreateUserDto;
import com.example.demo.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreateUserMapper {

    public User toUser(CreateUserDto dto) {
        User user = new User();

        user.setFullName(dto.getFullName());

        user.setEmail(dto.getEmail());

        user.setPassword(dto.getPassword());
        return user;

    }


}
