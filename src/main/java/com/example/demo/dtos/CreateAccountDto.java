package com.example.demo.dtos;

import com.example.demo.enums.AccountTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
@AllArgsConstructor
public class CreateAccountDto {

    private Long userId;

    private AccountTypes accountType;
}
