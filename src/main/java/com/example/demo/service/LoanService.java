package com.example.demo.service;

import com.example.demo.dtos.CreateLoanDto;
import com.example.demo.dtos.GetLoanDto;
import com.example.demo.entity.Loan;
import com.example.demo.exceptions.LoanNotFoundException;
import com.example.demo.mapper.GetLoanMapper;
import com.example.demo.mapper.LoanMapper;
import com.example.demo.repository.LoanRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;


@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanMapper loanMapper;
    private final GetLoanMapper getLoanMapper;



    @Transactional
    public GetLoanDto createLoan(CreateLoanDto dto) {
        Loan loan   = loanMapper.toLoan(dto);
        loanRepository.save(loan);

        loan.setRemainingAmount(calculateOwedAmount(loan));
        loan.setNextPaymentDate(calculateNextPaymentDate(loan.getCreationDate()));

        return getLoanMapper.toGetLoanDTO(loan);
    }


    public GetLoanDto getLoanById(Long id) throws LoanNotFoundException {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan with ID " + id + " not found"));

        return getLoanMapper.toGetLoanDTO(loan);
    }



    public void deleteLoan(Long id) throws LoanNotFoundException {
        if (!loanRepository.existsById(id)) {
           throw new LoanNotFoundException("Loan with ID " + id + " not found");
        }
        loanRepository.deleteById(id);
    }

    public BigDecimal calculateOwedAmount(Loan loan){

        double interest = loan.getInterestRate();
        BigDecimal principal = loan.getLoanAmount();
        int years = loan.getTermYears();

        BigDecimal interestAmount = principal.multiply(BigDecimal.valueOf(interest/100)).multiply(BigDecimal.valueOf(years));

        return loan.getLoanAmount().add(interestAmount);
    }


    public Date calculateNextPaymentDate(Date creationDate){
        Calendar cal = Calendar.getInstance();
        cal.setTime(creationDate);       // set the starting date
        cal.add(Calendar.DAY_OF_MONTH, 30); // add 30 days
        return cal.getTime();
    }

}
