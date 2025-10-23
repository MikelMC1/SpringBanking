package com.example.demo.dtos;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class CreateLoanDto {

    private Long userId;

    private Long accountId;


    private BigDecimal loanAmount;


    private Double interestRate;


    private int termYears;


    public CreateLoanDto() {

    }
}
