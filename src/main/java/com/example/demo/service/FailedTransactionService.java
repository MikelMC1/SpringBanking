package com.example.demo.service;

import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.entity.Transaction;
import com.example.demo.mapper.CreateTransactionMapper;
import com.example.demo.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FailedTransactionService {

    private final TransactionRepository transactionRepository;
    private final CreateTransactionMapper createtransactionMapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createFailedTransaction(CreateTransactionDto dto) {
        Transaction transaction = createtransactionMapper.toEntity(dto);
        transactionRepository.save(transaction);
    }
}

