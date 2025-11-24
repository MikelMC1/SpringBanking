package com.example.demo.mapper;

import com.example.demo.dtos.CardDto;
import com.example.demo.entity.Account;
import com.example.demo.entity.Card;
import com.example.demo.entity.User;
import com.example.demo.exceptions.AccountNotFoundException;
import com.example.demo.exceptions.UserNotFoundException;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor

public class CardMapper {

    private final AccountRepository accountRepository;



    public Card CardDtoToCard(CardDto cardDto){
        Card card = new Card();

        card.setFullName(cardDto.getFullName());
        card.setCardType(cardDto.getCardType());

        Account account = accountRepository.findById(cardDto.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + cardDto.getAccountId()));
        card.setAccount(account);



        return  card;

    }
    
    public CardDto CardToCardDto(Card card){
        if (card == null) {
            return null;
        }
        
        return CardDto.builder()
                .cardId(card.getCardId())
                .accountId(card.getAccount() != null ? card.getAccount().getAccountId() : null)
                .fullName(card.getFullName())
                .cardType(card.getCardType())
                .expMonth(card.getExpMonth())
                .expYear(card.getExpYear())
                .cardNumber(card.getCardNumber())
                .CVV(card.getCVV())
                .status(card.getStatus())
                .build();
    }
}
