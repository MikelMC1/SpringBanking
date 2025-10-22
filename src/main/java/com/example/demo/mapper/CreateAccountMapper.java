package com.example.demo.mapper;

import com.example.demo.dtos.CreateAccountDto;
import com.example.demo.entity.Account;
import com.example.demo.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreateAccountMapper {

    public Account toAccount(CreateAccountDto dto, User user)  {
        Account account = new Account();

        account.setAccountType(dto.getAccountType());

        account.setUser(user);

        return account;
    }







}
