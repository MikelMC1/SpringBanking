package com.example.demo.controller;
import com.example.demo.dtos.CardDto;
import com.example.demo.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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



}
