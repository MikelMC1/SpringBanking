package com.example.demo.service;

import com.example.demo.dtos.CardDto;
import com.example.demo.entity.Card;
import com.example.demo.enums.CardStatus;
import com.example.demo.mapper.CardMapper;
import com.example.demo.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final SecureRandom secureRandom = new SecureRandom();
    private static final int MAX_GENERATION_ATTEMPTS = 5;

    private final CardRepository cardRepository;
    private final CardMapper cardMapper;



    public void applyForCard(CardDto cardDto) {


        Card card = cardMapper.CardDtoToCard(cardDto);


        String cardNumber = generateUniqueCardNumber();
        card.setCardNumber(cardNumber);


        card.setCVV(secureRandom.nextInt(900) + 100);

        LocalDate now = LocalDate.now();
        card.setExpMonth(now.getMonthValue());
        card.setExpYear(now.getYear() + 3);

        cardRepository.save(card);
    }

    private String generateUniqueCardNumber() {
        for (int i = 0; i < MAX_GENERATION_ATTEMPTS; i++) {
            String number = generate16DigitNumber();
            if (!cardRepository.existsByCardNumber(number)) {
                return number;
            }
        }
        throw new RuntimeException("Failed to generate unique card number");
    }

    private String generate16DigitNumber() {
        StringBuilder sb = new StringBuilder(16);
        for (int i = 0; i < 16; i++) {
            sb.append(secureRandom.nextInt(10));
        }
        return sb.toString();
    }
    
    public List<CardDto> getCardsByAccountId(Long accountId) {
        List<Card> cards = cardRepository.findByAccount_AccountId(accountId);
        return cards.stream()
                .map(cardMapper::CardToCardDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CardDto freezeCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        
        if (card.getStatus() == CardStatus.BLOCKED || card.getStatus() == CardStatus.LOST || card.getStatus() == CardStatus.STOLEN) {
            throw new RuntimeException("Cannot freeze a " + card.getStatus().name().toLowerCase() + " card");
        }
        
        if (card.getStatus() == CardStatus.FROZEN) {
            card.setStatus(CardStatus.ACTIVE);
        } else {
            card.setStatus(CardStatus.FROZEN);
        }
        
        cardRepository.save(card);
        return cardMapper.CardToCardDto(card);
    }

    @Transactional
    public CardDto blockCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        
        if (card.getStatus() == CardStatus.BLOCKED) {
            throw new RuntimeException("Card is already blocked");
        }
        
        card.setStatus(CardStatus.BLOCKED);
        cardRepository.save(card);
        return cardMapper.CardToCardDto(card);
    }

    @Transactional
    public CardDto reportCardLost(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        
        if (card.getStatus() == CardStatus.BLOCKED || card.getStatus() == CardStatus.STOLEN) {
            throw new RuntimeException("Card is already " + card.getStatus().name().toLowerCase());
        }
        
        card.setStatus(CardStatus.LOST);
        cardRepository.save(card);
        return cardMapper.CardToCardDto(card);
    }

    @Transactional
    public CardDto reportCardStolen(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        
        if (card.getStatus() == CardStatus.BLOCKED || card.getStatus() == CardStatus.LOST) {
            throw new RuntimeException("Card is already " + card.getStatus().name().toLowerCase());
        }
        
        card.setStatus(CardStatus.STOLEN);
        cardRepository.save(card);
        return cardMapper.CardToCardDto(card);
    }
}
