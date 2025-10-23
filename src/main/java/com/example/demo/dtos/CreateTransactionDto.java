package com.example.demo.dtos;


import com.example.demo.enums.TransactionStatus;
import com.example.demo.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CreateTransactionDto {


    private Long userID;

    private Long user2Id;

    private TransactionType transactionType;

    private TransactionStatus transactionStatus;

    private double amount;

    public CreateTransactionDto() {

    }
}
