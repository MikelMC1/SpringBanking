package com.example.demo.controller;


import com.example.demo.dtos.PaymentDtos;
import com.example.demo.exceptions.LoanNotFoundException;
import com.example.demo.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v4")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PatchMapping("/transaction/withdraw")
    public ResponseEntity<String> withdrawMoney(@RequestBody PaymentDtos dto) {
        transactionService.withdrawMoney(dto);  // pass entire DTO
        return ResponseEntity.ok("Money withdrawn successfully!");
    }


    @PatchMapping("/transaction/deposit")
    public ResponseEntity<String> addMoney(@RequestBody PaymentDtos dto)  {
        transactionService.addMoney(dto.getAccountId(), dto.getAmount());
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






}
