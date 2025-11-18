package com.example.demo.entity;

import com.example.demo.enums.TransactionMethod;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;


@Entity
@Table(name = "transactions")
@Data
public class Transaction {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "account2_id", nullable = true)
    private Account account2;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Date creationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus transactionStatus;

    @Enumerated(EnumType.STRING)
    @Column
    private TransactionMethod transactionMethod;

    @ManyToOne
    @JoinColumn(name = "card_id")  // Foreign key column in Transaction table
    private Card card;

    @Column
    private double amount;








}
