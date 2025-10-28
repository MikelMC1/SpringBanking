package com.example.demo.controller;

import com.example.demo.dtos.CreateAccountDto;
import com.example.demo.dtos.GetAccountDto;
import com.example.demo.entity.Account;
import com.example.demo.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;


    @GetMapping("/account/{id}")
    public GetAccountDto getUser(@PathVariable Long id) throws Exception {
        return accountService.getAccountById(id);
    }


    @PostMapping("/account")
    public GetAccountDto createAccount(@RequestBody CreateAccountDto dto) throws Exception {
        Account account = accountService.createAccount(dto);


        return new GetAccountDto(
                account.getAccountId(),
                account.getBalance(),
                account.getLastUpdate(),
                account.getAccountType()
        );
    }



    @DeleteMapping("/account/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok("User deleted successfully!");
    }













}
