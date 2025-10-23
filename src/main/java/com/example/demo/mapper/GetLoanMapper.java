package com.example.demo.mapper;

import com.example.demo.dtos.GetLoanDto;
import com.example.demo.entity.Loan;
import org.springframework.stereotype.Component;

@Component
public class GetLoanMapper {

    public GetLoanDto toGetLoanDTO(Loan loan) {
        if (loan == null) {
            return null;
        }

        GetLoanDto dto = new GetLoanDto();
        dto.setLoanId(loan.getLoanId());
        dto.setLoanAmount(loan.getLoanAmount());
        dto.setRemainingAmount(loan.getRemainingAmount());
        dto.setInterestRate(loan.getInterestRate());
        dto.setTermYears(loan.getTermYears());
        dto.setNextPaymentDate(loan.getNextPaymentDate());
        dto.setStatus(loan.getStatus());

        if (loan.getAccount() != null) {
            dto.setAccountId(loan.getAccount().getAccountId());
        }

        return dto;
    }
}
