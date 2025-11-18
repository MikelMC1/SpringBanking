package com.example.demo.service;

import com.example.demo.dtos.CardDto;
import com.example.demo.entity.Card;
import com.example.demo.mapper.CardMapper;
import com.example.demo.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;

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
}
