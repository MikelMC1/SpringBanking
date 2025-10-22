package com.example.demo.dtos;

import java.math.BigDecimal;
import java.util.Date;

public class GetLoanDto {

    private Long loanId;

    private Long accountId;

    private BigDecimal loanAmount;

    private BigDecimal remainingAmount;

    private Double interestRate;

    private Integer termYears;

    private Date nextPaymentDate;

    private String status;

}
