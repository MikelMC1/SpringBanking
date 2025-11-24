package com.example.demo.dtos;

import com.example.demo.enums.TransactionMethod;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
public class CreateTransactionDto {


    private Long transactionId;

    private Long accountId;

    private Long account2Id;

    private TransactionType transactionType;

    private TransactionStatus transactionStatus;

    private TransactionMethod transactionMethod;

    private Long cardId;

    private double amount;

    private Date creationDate;

    public CreateTransactionDto() {

    }
}
