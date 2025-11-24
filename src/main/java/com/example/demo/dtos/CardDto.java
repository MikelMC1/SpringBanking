package com.example.demo.dtos;
import com.example.demo.entity.Account;
import com.example.demo.enums.CardType;
import com.example.demo.enums.CardStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Data
@Builder
@AllArgsConstructor
@Component
@RequiredArgsConstructor


public class CardDto {

    private Long cardId;

    private Long accountId;

    private String fullName;

    private CardType cardType;

    private int expMonth;

    private int expYear;
    
    private String cardNumber;
    
    private int CVV;
    
    private CardStatus status;

}
