package com.example.demo.mapper;

import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.entity.Account;
import com.example.demo.entity.Card;
import com.example.demo.entity.Transaction;
import com.example.demo.exceptions.AccountNotFoundException;
import com.example.demo.exceptions.CardNotFoundException;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreateTransactionMapper {

    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;

    public Transaction toEntity(CreateTransactionDto dto) {
        if (dto == null) {
            return null;
        }

        Transaction transaction = new Transaction();


        if (dto.getAccountId() != null) {
            Account account1 = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new AccountNotFoundException("Account not found"));
            transaction.setAccount(account1);
        }

        if (dto.getAccount2Id() != null) {
            Account account2 = accountRepository.findById(dto.getAccount2Id())
                    .orElseThrow(() -> new AccountNotFoundException("Account2 not found"));
            transaction.setAccount2(account2);
        }


        if (dto.getCardId() != null) {
            Card card = cardRepository.findById(dto.getCardId())
                    .orElseThrow(() -> new CardNotFoundException("Card not found"));
            transaction.setCard(card);
        }

        transaction.setTransactionType(dto.getTransactionType());
        transaction.setTransactionStatus(dto.getTransactionStatus());
        transaction.setTransactionMethod(dto.getTransactionMethod());
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
                .transactionMethod(transaction.getTransactionMethod())
                .cardId(transaction.getCard() != null ? transaction.getCard().getCardId() : null)
                .amount(transaction.getAmount())
                .build();
    }
}
