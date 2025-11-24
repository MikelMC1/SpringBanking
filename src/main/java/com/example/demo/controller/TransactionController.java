package com.example.demo.controller;


import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.dtos.PaymentDtos;
import com.example.demo.exceptions.LoanNotFoundException;
import com.example.demo.service.TransactionService;
import com.example.demo.service.auth.AuthService;
import com.example.demo.service.auth.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v4")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final JwtService jwtService;

    @PatchMapping("/transaction/withdraw")
    public ResponseEntity<String> withdrawMoney(@RequestBody PaymentDtos dto) {
        transactionService.withdrawMoney(dto);  // pass entire DTO
        return ResponseEntity.ok("Money withdrawn successfully!");
    }


    @PatchMapping("/transaction/deposit")
    public ResponseEntity<String> addMoney(@RequestBody PaymentDtos dto)  {
        transactionService.depositMoney(dto);
        return ResponseEntity.ok("Money added successfully!");
    }

    @PatchMapping("/transaction/transfer")
    public ResponseEntity<String> transferMoney(@RequestBody PaymentDtos dto)  {
        transactionService.transferMoney(dto);

        return ResponseEntity.ok("Money transferred successfully!");
    }

    @PatchMapping("/transaction/payment/loan")
    public ResponseEntity<String> loanPayment(@RequestBody PaymentDtos dto) throws LoanNotFoundException {

        transactionService.makeLoanPayment(dto);

        return ResponseEntity.ok("Payment Successful for loan "+dto.getLoanId()+" and account "+dto.getAccountId());
    }

    @GetMapping("/transaction")
    public ResponseEntity<?> getAllTransactions(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Extract userId from JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Authorization header is required");
            }
            String token = authHeader.replace("Bearer ", "");
            Long userId = jwtService.getAuthenticatedUserId(token);
            
            List<CreateTransactionDto> transactions = transactionService.getAllTransactions(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token: " + e.getMessage());
        }
    }

    @GetMapping("/transaction/account/{accountId}")
    public ResponseEntity<?> getTransactionsByAccount(
            @PathVariable Long accountId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Extract userId from JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Authorization header is required");
            }
            String token = authHeader.replace("Bearer ", "");
            Long userId = jwtService.getAuthenticatedUserId(token);
            
            List<CreateTransactionDto> transactions = transactionService.getTransactionsByAccountId(accountId, userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token: " + e.getMessage());
        }
    }






}
