package com.example.demo.repository;

import com.example.demo.entity.Loan;
import com.example.demo.enums.LoanStatus;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {


    List<Loan> findByStatus(LoanStatus status);

}
