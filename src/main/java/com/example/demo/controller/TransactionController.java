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


    @PatchMapping("/transaction/withdraw/{id}")
    public ResponseEntity<String> removeMoney(@PathVariable Long id, @RequestBody double amount)  {
        transactionService.removeMoney(id,amount);
        return ResponseEntity.ok("Money withdrawn successfully!");
    }

    @PatchMapping("/transaction/deposit/{id}")
    public ResponseEntity<String> addMoney(@PathVariable Long id, @RequestBody double amount)  {
        transactionService.addMoney(id,amount);
        return ResponseEntity.ok("Money added successfully!");
    }

    @PatchMapping("/transaction/transfer/{id}/{id2}")
    public ResponseEntity<String> transferMoney(@PathVariable Long id, @PathVariable Long id2, @RequestBody double amount)  {
        transactionService.transferMoney(id,id2,amount);

        return ResponseEntity.ok("Money transferred successfully!");
    }

    @PatchMapping("/transaction/payment/loan")
    public ResponseEntity<String> loanPayment(@RequestBody PaymentDtos dto) throws LoanNotFoundException {

        transactionService.makeLoanPayment(dto.getLoanId(),dto.getAccountId(),dto.getAmount());

        return ResponseEntity.ok("Payment Successful for loan "+dto.getLoanId()+" and account "+dto.getAccountId());
    }






}
