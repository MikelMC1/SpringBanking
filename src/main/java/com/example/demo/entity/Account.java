package com.example.demo.entity;
import com.example.demo.enums.AccountTypes;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Data

public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @Column(nullable = false)
    private BigDecimal balance = BigDecimal.ZERO;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private Date lastUpdate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountTypes accountType;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Card> cards;



}
