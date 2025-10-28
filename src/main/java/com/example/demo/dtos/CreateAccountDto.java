package com.example.demo.dtos;

import com.example.demo.entity.Account;
import com.example.demo.entity.User;
import com.example.demo.enums.AccountTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Data
@Builder
@AllArgsConstructor
@Component
@RequiredArgsConstructor
public class CreateAccountDto {

    private Long userId;

    private AccountTypes accountType;



    public Account toAccount(CreateAccountDto dto, User user)  {
        Account account = new Account();

        account.setAccountType(dto.getAccountType());

        account.setUser(user);

        return account;
    }


}
