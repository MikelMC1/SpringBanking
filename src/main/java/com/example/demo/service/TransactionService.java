package com.example.demo.service;

import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.dtos.PaymentDtos;
import com.example.demo.entity.Account;
import com.example.demo.entity.Card;
import com.example.demo.entity.Loan;
import com.example.demo.entity.Transaction;
import com.example.demo.enums.TransactionMethod;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.enums.TransactionType;
import com.example.demo.exceptions.AccountNotFoundException;
import com.example.demo.exceptions.InsufficientBalanceException;
import com.example.demo.exceptions.LoanNotFoundException;
import com.example.demo.mapper.CreateTransactionMapper;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.CardRepository;
import com.example.demo.repository.LoanRepository;
import com.example.demo.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor

public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CreateTransactionMapper createtransactionMapper;
    private final AccountRepository accountRepository;
    private final LoanRepository loanRepository;
    private final CardRepository cardRepository;


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
            throw new InsufficientBalanceException("Insufficient funds");
        }

        targetAccount.setBalance(newBalance);
        accountRepository.save(targetAccount);

    }

    @Transactional
    public void withdrawMoney(PaymentDtos dto) {
        removeMoney(dto.getAccountId(), dto.getAmount());

        CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                .AccountId(dto.getAccountId())
                .transactionType(TransactionType.WITHDRAW)
                .transactionStatus(TransactionStatus.APPROVED)
                .transactionMethod(dto.getTransactionMethod())
                .amount(dto.getAmount())
                .build();

        createTransaction(transactionDto);
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

    }

    @Transactional
    public void depositMoney(PaymentDtos dto) {

        addMoney(dto.getAccountId(), dto.getAmount());

        CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                .AccountId(dto.getAccountId())
                .transactionType(TransactionType.DEPOSIT)
                .transactionStatus(TransactionStatus.APPROVED)
                .transactionMethod(dto.getTransactionMethod())
                .amount(dto.getAmount())
                .build();

        createTransaction(transactionDto);
    }



    @Transactional
    public void transferMoney(PaymentDtos dto) {

        removeMoney(dto.getAccountId(),dto.getAmount());
        addMoney(dto.getAccount2Id(), dto.getAmount());

        TransactionType type = TransactionType.TRANSFER;

        if (dto.getCardId() != null) {
            type = TransactionType.PAYMENT;
        }

        CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                .AccountId(dto.getAccountId())
                .Account2Id(dto.getAccount2Id())  //not null
                .transactionType(type)
                .transactionMethod(dto.getTransactionMethod())
                .cardId(dto.getCardId())
                .transactionStatus(TransactionStatus.APPROVED)
                .amount(dto.getAmount())
                .build();

        createTransaction(transactionDto);


    }



    public void createTransaction(CreateTransactionDto dto) {
        Transaction transaction = createtransactionMapper.toEntity(dto);
        transactionRepository.save(transaction);
    }


    @Transactional
    public void  makeLoanPayment(PaymentDtos dto) throws LoanNotFoundException {

        Account targetAccount = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        Loan targetLoan = loanRepository.findById(dto.getLoanId())
                .orElseThrow(() -> new LoanNotFoundException("Loan was not found"));


        removeMoney(targetAccount.getAccountId(),dto.getAmount());

        BigDecimal currentLoan = targetLoan.getRemainingAmount();
        BigDecimal amountToSubtract = BigDecimal.valueOf(dto.getAmount());

        BigDecimal newRemaining = currentLoan.subtract(amountToSubtract);

        targetLoan.setRemainingAmount(newRemaining);

        loanRepository.save(targetLoan);

        CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                .AccountId(dto.getAccountId())
                .Account2Id(null) // payment for loan so no second user
                .transactionType(TransactionType.LOAN_PAYMENT)
                .transactionStatus(TransactionStatus.APPROVED)
                .transactionMethod(dto.getTransactionMethod())
                .cardId(dto.getCardId())
                .amount(dto.getAmount())
                .build();

        createTransaction(transactionDto);

    }

    //public void week

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
