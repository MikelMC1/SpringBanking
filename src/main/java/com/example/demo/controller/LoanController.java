package com.example.demo.controller;
import com.example.demo.dtos.CreateLoanDto;
import com.example.demo.dtos.GetLoanDto;
import com.example.demo.exceptions.LoanNotFoundException;
import com.example.demo.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v3")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;


    @PostMapping("/loan")
    public GetLoanDto getLoan(@RequestBody CreateLoanDto dto){

        return loanService.createLoan(dto);
    }

    @GetMapping("/loan/{id}")
    public GetLoanDto getLoanById(@PathVariable Long id) throws LoanNotFoundException {
      return  loanService.getLoanById(id);
    }

    @DeleteMapping("/loan/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) throws LoanNotFoundException {
        loanService.deleteLoan(id);

        return ResponseEntity.ok("Loan deleted successfully!");
    }

    @GetMapping("/loan/account/{accountId}")
    public ResponseEntity<List<GetLoanDto>> getLoansByAccount(@PathVariable Long accountId) {
        List<GetLoanDto> loans = loanService.getLoansByAccountId(accountId);
        return ResponseEntity.ok(loans);
    }

}
