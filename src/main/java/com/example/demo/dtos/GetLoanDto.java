package com.example.demo.dtos;

import com.example.demo.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetLoanDto {

    private Long loanId;

    private Long accountId;

    private BigDecimal loanAmount;

    private BigDecimal remainingAmount;

    private Double interestRate;

    private Integer termYears;

    private Date nextPaymentDate;

    private LoanStatus status;

}
