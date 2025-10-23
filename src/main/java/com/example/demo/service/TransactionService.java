package com.example.demo.service;


import com.example.demo.dtos.CreateTransactionDto;
import com.example.demo.dtos.GetUserDTO;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.enums.TransactionType;
import com.example.demo.mapper.CreateTransactionMapper;
import com.example.demo.mapper.GetUserMapper;
import com.example.demo.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class TransactionService {


    private final AccountService accountService;
    private final TransactionRepository transactionRepository;
    private final CreateTransactionMapper transactionMapper;
    private final UserService userService;
    private final GetUserMapper getUserMapper;
    //TODO

    @Transactional
    public Transaction createTransaction(CreateTransactionDto dto) throws Exception {
        GetUserDTO user1Dto = userService.getUserById(dto.getUserID());
        GetUserDTO user2Dto = (dto.getUser2Id() != null) ? userService.getUserById(dto.getUser2Id()) : null;

        User user1 = getUserMapper.toEntity(user1Dto);
        User user2 = (user2Dto != null) ? getUserMapper.toEntity(user2Dto) : null;

        Transaction transaction = transactionMapper.toEntity(dto, user1, user2);
        transaction.setTransactionStatus(TransactionStatus.PENDING);

        if (user2 != null) {
            transferMoney(user1.getId(), user2.getId(), dto.getAmount());
            transaction.setTransactionStatus(TransactionStatus.APPROVED);
        } else {
            withdrawOrDeposit(user1, dto.getAmount(), dto.getTransactionType());
            transaction.setTransactionStatus(TransactionStatus.APPROVED);
        }
        return transactionRepository.save(transaction);
    }



    @Transactional
    public Transaction updateTransactionStatus(Long id, TransactionStatus newStatus) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setTransactionStatus(newStatus);
        return transactionRepository.save(transaction);
    }



    @Transactional
    public void transferMoney(Long userId,Long userId2, double amount) {


    }


    //TODO
    public void withdrawOrDeposit(User user, double amount, TransactionType transactionType) {

    }



    public void RemoveMoney(Long userId){

    }




    public void AddMoney(Long userId)
    {
    }





    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
