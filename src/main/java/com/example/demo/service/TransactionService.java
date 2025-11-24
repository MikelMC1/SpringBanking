package com.example.demo.service;

import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.dtos.PaymentDtos;
import com.example.demo.entity.Account;
import com.example.demo.entity.Card;
import com.example.demo.entity.Loan;
import com.example.demo.entity.Transaction;
import com.example.demo.enums.LoanStatus;
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
import com.example.demo.repository.AccountRepository;
import com.example.demo.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CreateTransactionMapper createtransactionMapper;
    private final AccountRepository accountRepository;
    private final LoanRepository loanRepository;
    private final CardRepository cardRepository;
    private final FailedTransactionService failedTransactionService;


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
        try {
            removeMoney(dto.getAccountId(), dto.getAmount());

            CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                    .accountId(dto.getAccountId())
                    .transactionType(TransactionType.WITHDRAW)
                    .transactionStatus(TransactionStatus.APPROVED)
                    .transactionMethod(dto.getTransactionMethod())
                    .amount(dto.getAmount())
                    .build();

            createTransaction(transactionDto);
        } catch (InsufficientBalanceException e) {
            // Create failed transaction record in a new transaction
            try {
                CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                        .accountId(dto.getAccountId())
                        .transactionType(TransactionType.WITHDRAW)
                        .transactionStatus(TransactionStatus.FAILED)
                        .transactionMethod(dto.getTransactionMethod())
                        .amount(dto.getAmount())
                        .build();

                failedTransactionService.createFailedTransaction(transactionDto);
                System.out.println("Successfully created failed transaction record for withdraw");
            } catch (Exception ex) {
                // Log but don't fail if we can't create the failed transaction record
                System.err.println("Failed to create failed transaction record: " + ex.getMessage());
                ex.printStackTrace();
            }
            throw e; // Re-throw to notify the caller
        }
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
                .accountId(dto.getAccountId())
                .transactionType(TransactionType.DEPOSIT)
                .transactionStatus(TransactionStatus.APPROVED)
                .transactionMethod(dto.getTransactionMethod())
                .amount(dto.getAmount())
                .build();

        createTransaction(transactionDto);
    }



    @Transactional
    public void transferMoney(PaymentDtos dto) {
        try {
            removeMoney(dto.getAccountId(),dto.getAmount());
            addMoney(dto.getAccount2Id(), dto.getAmount());

            TransactionType type = TransactionType.TRANSFER;

            if (dto.getCardId() != null) {
                type = TransactionType.PAYMENT;
            }

            CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                    .accountId(dto.getAccountId())
                    .account2Id(dto.getAccount2Id())  //not null
                    .transactionType(type)
                    .transactionMethod(dto.getTransactionMethod())
                    .cardId(dto.getCardId())
                    .transactionStatus(TransactionStatus.APPROVED)
                    .amount(dto.getAmount())
                    .build();

            createTransaction(transactionDto);
        } catch (InsufficientBalanceException e) {
            // Create failed transaction record in a new transaction
            try {
                TransactionType type = TransactionType.TRANSFER;
                if (dto.getCardId() != null) {
                    type = TransactionType.PAYMENT;
                }

                CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                        .accountId(dto.getAccountId())
                        .account2Id(dto.getAccount2Id())
                        .transactionType(type)
                        .transactionMethod(dto.getTransactionMethod())
                        .cardId(dto.getCardId())
                        .transactionStatus(TransactionStatus.FAILED)
                        .amount(dto.getAmount())
                        .build();

                failedTransactionService.createFailedTransaction(transactionDto);
            } catch (Exception ex) {
                // Log but don't fail if we can't create the failed transaction record
                System.err.println("Failed to create failed transaction record: " + ex.getMessage());
            }
            throw e; // Re-throw to notify the caller
        }
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

        try {
            removeMoney(targetAccount.getAccountId(),dto.getAmount());

            BigDecimal currentLoan = targetLoan.getRemainingAmount();
            BigDecimal amountToSubtract = BigDecimal.valueOf(dto.getAmount());

            BigDecimal newRemaining = currentLoan.subtract(amountToSubtract);

            // If loan is fully paid off, set remaining to 0 and update status
            if (newRemaining.compareTo(BigDecimal.ZERO) <= 0) {
                targetLoan.setRemainingAmount(BigDecimal.ZERO);
                targetLoan.setStatus(LoanStatus.PAID_OFF);
            } else {
                targetLoan.setRemainingAmount(newRemaining);
            }

            loanRepository.save(targetLoan);

            CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                    .accountId(dto.getAccountId())
                    .account2Id(null) // payment for loan so no second user
                    .transactionType(TransactionType.LOAN_PAYMENT)
                    .transactionStatus(TransactionStatus.APPROVED)
                    .transactionMethod(dto.getTransactionMethod())
                    .cardId(dto.getCardId())
                    .amount(dto.getAmount())
                    .build();

            createTransaction(transactionDto);
        } catch (InsufficientBalanceException e) {
            // Create failed transaction record in a new transaction
            try {
                CreateTransactionDto transactionDto = CreateTransactionDto.builder()
                        .accountId(dto.getAccountId())
                        .account2Id(null)
                        .transactionType(TransactionType.LOAN_PAYMENT)
                        .transactionStatus(TransactionStatus.FAILED)
                        .transactionMethod(dto.getTransactionMethod())
                        .cardId(dto.getCardId())
                        .amount(dto.getAmount())
                        .build();

                failedTransactionService.createFailedTransaction(transactionDto);
            } catch (Exception ex) {
                // Log but don't fail if we can't create the failed transaction record
                System.err.println("Failed to create failed transaction record: " + ex.getMessage());
            }
            throw e; // Re-throw to notify the caller
        }

    }

    public List<CreateTransactionDto> getAllTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        return transactions.stream()
                .map(createtransactionMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<CreateTransactionDto> getTransactionsByAccountId(Long accountId, Long userId) {
        // Verify that the account belongs to the user
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
        
        if (!account.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied: Account does not belong to user");
        }
        
        List<Transaction> transactions = transactionRepository.findByAccount_AccountIdOrderByCreationDateDesc(accountId);
        return transactions.stream()
                .map(createtransactionMapper::toDto)
                .collect(Collectors.toList());
    }


    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
