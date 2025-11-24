package com.example.demo.controller;
import com.example.demo.dtos.CardDto;
import com.example.demo.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v5")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/Card")
    public ResponseEntity<String> createCard(@RequestBody CardDto dto){

        cardService.applyForCard(dto);
        return ResponseEntity.ok("Card created successfully!");
    }
    
    @GetMapping("/card/account/{accountId}")
    public ResponseEntity<List<CardDto>> getCardsByAccount(@PathVariable Long accountId) {
        List<CardDto> cards = cardService.getCardsByAccountId(accountId);
        return ResponseEntity.ok(cards);
    }

    @PatchMapping("/card/{cardId}/freeze")
    public ResponseEntity<CardDto> freezeCard(@PathVariable Long cardId) {
        CardDto card = cardService.freezeCard(cardId);
        return ResponseEntity.ok(card);
    }

    @PatchMapping("/card/{cardId}/block")
    public ResponseEntity<CardDto> blockCard(@PathVariable Long cardId) {
        CardDto card = cardService.blockCard(cardId);
        return ResponseEntity.ok(card);
    }

    @PatchMapping("/card/{cardId}/report-lost")
    public ResponseEntity<CardDto> reportCardLost(@PathVariable Long cardId) {
        CardDto card = cardService.reportCardLost(cardId);
        return ResponseEntity.ok(card);
    }

    @PatchMapping("/card/{cardId}/report-stolen")
    public ResponseEntity<CardDto> reportCardStolen(@PathVariable Long cardId) {
        CardDto card = cardService.reportCardStolen(cardId);
        return ResponseEntity.ok(card);
    }

}
