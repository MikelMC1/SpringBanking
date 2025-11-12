package com.example.demo.service;


import com.example.demo.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class CardService {


    private final AccountService accountService;
    private final CardRepository cardRepository;


    //public void applyForCard()





}
