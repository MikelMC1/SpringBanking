package com.example.demo.repository;
import com.example.demo.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    boolean existsByCardNumber(String cardNumber);
    
    List<Card> findByAccount_AccountId(Long accountId);

}
