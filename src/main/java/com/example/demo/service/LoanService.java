package com.example.demo.service;

import com.example.demo.dtos.CreateLoanDto;
import com.example.demo.dtos.CreateUserDto;
import com.example.demo.entity.Loan;
import com.example.demo.entity.User;
import com.example.demo.enums.LoanStatus;
import com.example.demo.exceptions.LoanNotFoundException;
import com.example.demo.mapper.LoanMapper;
import com.example.demo.repository.LoanRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanMapper loanMapper;



    @Transactional
    public Loan createLoan(CreateLoanDto dto) {
        Loan loan   = loanMapper.toLoan(dto);
        return loanRepository.save(loan);
    }


    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }


    public Loan getLoanById(Long id) throws LoanNotFoundException {
        return loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan with ID " + id + " not found"));
    }

    //TODO
    public Loan updateLoan(Long id, CreateLoanDto dto) throws LoanNotFoundException {
        Loan existingLoan = loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan with ID " + id + " not found"));


        loanMapper.updateLoanFromDto(existingLoan, dto);

        return loanRepository.save(existingLoan);
    }

    public void deleteLoan(Long id) throws LoanNotFoundException {
        if (!loanRepository.existsById(id)) {
           throw new LoanNotFoundException("Loan with ID " + id + " not found");
        }
        loanRepository.deleteById(id);
    }


    public List<Loan> getActiveLoans() {
        return loanRepository.findByStatus(LoanStatus.ACTIVE);
    }


    public Loan updateRemainingAmount(Long loanId, BigDecimal newRemaining) throws LoanNotFoundException {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new LoanNotFoundException("Loan with ID " + loanId + " not found"));

        loan.setRemainingAmount(newRemaining);
        return loanRepository.save(loan);
    }
}
