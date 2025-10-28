package com.example.demo.mapper;

import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.entity.Account;
import com.example.demo.entity.Transaction;
import org.springframework.stereotype.Component;


@Component
public class CreateTransactionMapper {

    public Transaction toEntity(CreateTransactionDto dto, Account account1, Account account2) {
        if (dto == null) {
            return null;
        }


        Transaction transaction = new Transaction();
        transaction.setAccount(account1);
        transaction.setAccount2(account2);
        transaction.setTransactionType(dto.getTransactionType());
        transaction.setTransactionStatus(dto.getTransactionStatus());
        transaction.setAmount(dto.getAmount());
        return transaction;
    }

    public CreateTransactionDto toDto(Transaction transaction) {
        if (transaction == null) {
            return null;
        }

        return CreateTransactionDto.builder()
                .AccountId(transaction.getAccount() != null ? transaction.getAccount().getAccountId() : null)
                .Account2Id(transaction.getAccount2() != null ? transaction.getAccount2().getAccountId() : null)
                .transactionType(transaction.getTransactionType())
                .transactionStatus(transaction.getTransactionStatus())
                .amount(transaction.getAmount())
                .build();
    }
}
