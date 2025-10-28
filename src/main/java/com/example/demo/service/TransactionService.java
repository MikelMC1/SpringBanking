package com.example.demo.service;

import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.entity.Account;
import com.example.demo.entity.Transaction;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.enums.TransactionType;
import com.example.demo.exceptions.AccountNotFoundException;
import com.example.demo.exceptions.InsufficentBalanceException;
import com.example.demo.mapper.CreateTransactionMapper;
import com.example.demo.mapper.GetUserMapper;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor

public class TransactionService {


    private final AccountService accountService;
    private final TransactionRepository transactionRepository;
    private final CreateTransactionMapper createtransactionMapper;
    private final UserService userService;
    private final GetUserMapper getUserMapper;
    private final AccountRepository accountRepository;


    @Transactional
    public Transaction updateTransactionStatus(Long id, TransactionStatus newStatus) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setTransactionStatus(newStatus);
        return transactionRepository.save(transaction);
    }


    @Transactional
    public void removeMoney(Long accountId,double amount) {
       Account targetAccount = accountRepository.findById(accountId)
               .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        BigDecimal currentBalance =targetAccount.getBalance();
        BigDecimal amountToRemove = BigDecimal.valueOf(amount);

        BigDecimal newBalance = currentBalance.subtract(amountToRemove);

        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new InsufficentBalanceException("Insufficient funds");
        }

        targetAccount.setBalance(newBalance);
        accountRepository.save(targetAccount);


        CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                .AccountId(targetAccount.getAccountId())
                .Account2Id(null) //
                .transactionType(TransactionType.WITHDRAW)
                .transactionStatus(TransactionStatus.APPROVED)
                .amount(amount)
                .build();

        createTransaction(transactionDto, targetAccount, null);
    }



    @Transactional
    public void addMoney(Long accountId, double amount)
    {
        Account targetAccount = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        BigDecimal currentBalance =targetAccount.getBalance();
        BigDecimal amountToAdd = BigDecimal.valueOf(amount);

        BigDecimal newBalance = currentBalance.add(amountToAdd);

        targetAccount.setBalance(newBalance);
        accountRepository.save(targetAccount);

        CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                .AccountId(targetAccount.getAccountId())
                .Account2Id(null) //
                .transactionType(TransactionType.DEPOSIT)
                .transactionStatus(TransactionStatus.APPROVED)
                .amount(amount)
                .build();

        createTransaction(transactionDto, targetAccount, null);

    }


    @Transactional
    public void transferMoney(Long accountId,Long targetAccountId, double amount) {

        Account account1 = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        Account account2 = accountRepository.findById(targetAccountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        removeMoney(account1.getAccountId(), amount);
        addMoney(account2.getAccountId(), amount);

        CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                .AccountId(account1.getAccountId())
                .Account2Id(account2.getAccountId())  //not null
                .transactionType(TransactionType.WITHDRAW)
                .transactionStatus(TransactionStatus.APPROVED)
                .amount(amount)
                .build();

        createTransaction(transactionDto, account1, account2);


    }


    public void createTransaction(CreateTransactionDto dto, Account account1, Account account2) {
        Transaction transaction =   createtransactionMapper.toEntity(dto,account1,account2);

        transactionRepository.save(transaction);

        createtransactionMapper.toDto(transaction);
    }







    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
