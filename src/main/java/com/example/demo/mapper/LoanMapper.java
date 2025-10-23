package com.example.demo.mapper;

import com.example.demo.dtos.CreateLoanDto;
import com.example.demo.entity.Account;
import com.example.demo.entity.Loan;
import com.example.demo.entity.User;
import com.example.demo.exceptions.UserNotFoundException;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoanMapper {


    private final UserRepository userRepository;
    private final AccountRepository accountRepository;


    public Loan toLoan(CreateLoanDto dto) {
        Loan loan = new Loan();

        loan.setLoanAmount(dto.getLoanAmount());
        loan.setInterestRate(dto.getInterestRate());
        loan.setTermYears(dto.getTermYears());


        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + dto.getUserId()));
        loan.setUser(user);

        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found with id: " + dto.getAccountId()));
        loan.setAccount(account);

        return loan;
    }

    public  void updateLoanFromDto(Loan existingLoan, CreateLoanDto dto) {
        existingLoan.setLoanAmount(dto.getLoanAmount());
        existingLoan.setInterestRate(dto.getInterestRate());
        existingLoan.setTermYears(dto.getTermYears());


        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + dto.getUserId()));
        existingLoan.setUser(user);
    }
}



