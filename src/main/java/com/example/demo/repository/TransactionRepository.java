package com.example.demo.repository;

import com.example.demo.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {

    List<Transaction> findByAccount_AccountIdOrderByCreationDateDesc(Long accountId);

    List<Transaction> findByAccount_AccountIdOrderByAmountDesc(Long accountId);

    @Query("SELECT t FROM Transaction t WHERE t.account.accountId = :accountId AND t.creationDate >= :weekAgo ORDER BY t.creationDate DESC")
    List<Transaction> findWeeklyTransactions(@Param("accountId") Long accountId, @Param("weekAgo") LocalDateTime weekAgo);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.user.id = :userId OR (t.account2 IS NOT NULL AND t.account2.user.id = :userId) ORDER BY t.creationDate DESC")
    List<Transaction> findByUserId(@Param("userId") Long userId);





}
