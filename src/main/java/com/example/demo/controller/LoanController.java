package com.example.demo.controller;

import com.example.demo.dtos.CreateLoanDto;
import com.example.demo.dtos.CreateUserDto;
import com.example.demo.dtos.GetLoanDto;
import com.example.demo.entity.Loan;
import com.example.demo.exceptions.LoanNotFoundException;
import com.example.demo.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v3")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/loan")
    public Loan getLoan(@RequestBody CreateLoanDto dto){
        return loanService.createLoan(dto);
    }

    @GetMapping("/loan/{id}")
    public Loan getLoanById(@PathVariable Long id) throws LoanNotFoundException {
      return  loanService.getLoanById(id);

    }

}
