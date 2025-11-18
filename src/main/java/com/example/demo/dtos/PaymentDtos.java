package com.example.demo.dtos;

import com.example.demo.entity.Card;
import com.example.demo.enums.TransactionMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDtos {

    private Long accountId;

    private Long account2Id;

    private Long loanId;

    private Double amount;

    private TransactionMethod transactionMethod;

    private Long cardId;

}
