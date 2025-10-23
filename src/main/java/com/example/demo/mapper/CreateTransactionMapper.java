package com.example.demo.mapper;

import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.dtos.GetUserDTO;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CreateTransactionMapper {

    public Transaction toEntity(CreateTransactionDto dto, User user1,User user2) {
        if (dto == null) {
            return null;
        }


        Transaction transaction = new Transaction();
        transaction.setUser(user1);
        transaction.setUser2(user2);
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
                .userID(transaction.getUser() != null ? transaction.getUser().getId() : null)
                .user2Id(transaction.getUser2() != null ? transaction.getUser2().getId() : null)
                .transactionType(transaction.getTransactionType())
                .transactionStatus(transaction.getTransactionStatus())
                .amount(transaction.getAmount())
                .build();
    }
}
