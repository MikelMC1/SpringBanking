package com.example.demo.entity;

import com.example.demo.enums.LoanStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "loans")
@Data
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long loanId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AccountId", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @Column(nullable = false)
    private BigDecimal loanAmount;


    @Column(nullable = false)
    private double interestRate;

    @Column(nullable = false)
    private int termYears;


    @Column
    private BigDecimal remainingAmount = BigDecimal.ZERO;


    @Temporal(TemporalType.DATE)
    private Date nextPaymentDate;


    @Enumerated(EnumType.STRING)
    @Column
    private LoanStatus status = LoanStatus.ACTIVE;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Date creationDate;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updateDate;
}
