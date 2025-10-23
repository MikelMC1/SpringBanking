package com.example.demo.mapper;

import com.example.demo.dtos.GetUserDTO;
import com.example.demo.entity.User;
import org.springframework.stereotype.Component;

@Component
public class GetUserMapper {

    public User toEntity(GetUserDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setId(dto.getId());          // matches your entity's ID field
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setCreateDate(dto.getCreateDate());
        user.setUpdateDate(dto.getUpdateDate());

        return user;
    }
}
