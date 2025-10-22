package com.example.demo.service;


import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.entity.Account;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.enums.TransactionType;
import com.example.demo.mapper.CreateTransactionMapper;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class TransactionService {


    private final AccountService accountService;
    private final TransactionRepository transactionRepository;
    private final CreateTransactionMapper transactionMapper;
    private final UserService userService;
    private final AccountRepository  accountRepository;

    //TODO
   /*
    @Transactional
    public Transaction createTransaction(CreateTransactionDto dto) {
        User user = userService.findById(dto.getUserID());
        User user2 = (dto.getUser2Id() != null) ? userService.findById(dto.getUser2Id()) : null;

        Transaction transaction = transactionMapper.toEntity(dto, user, user2);
        transaction.setTransactionStatus(TransactionStatus.PENDING);

        if (user2 != null) {
            transferMoney(user, user2, dto.getAmount());
            transaction.setTransactionStatus(TransactionStatus.APPROVED);
        } else {
            withdrawOrDeposit(user, dto.getAmount(), dto.getTransactionType());
            transaction.setTransactionStatus(TransactionStatus.APPROVED);
        }

        return transactionRepository.save(transaction);
    }
*/


    @Transactional
    public Transaction updateTransactionStatus(Long id, TransactionStatus newStatus) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setTransactionStatus(newStatus);
        return transactionRepository.save(transaction);
    }



    @Transactional
    public void transferMoney(User user, User user2, BigDecimal amount) {

    }


    //TODO
    public void withdrawOrDeposit(User user, double amount, TransactionType transactionType) {
    }





    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
