package com.example.demo.service;
import com.example.demo.dtos.CreateAccountDto;
import com.example.demo.dtos.GetAccountDto;
import com.example.demo.entity.Account;
import com.example.demo.entity.User;
import com.example.demo.exceptions.AccountNotFoundException;
import com.example.demo.exceptions.UserNotFoundException;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final CreateAccountDto createAccountDto;


    public Account createAccount(CreateAccountDto dto) throws UserNotFoundException {


        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Account account = createAccountDto.toAccount(dto, user);
        return accountRepository.save(account);
    }

    public GetAccountDto getAccountById(Long id) throws Exception {
        Optional<Account> accountOptional = accountRepository.findById(id);
        return accountOptional.map(
                v -> new GetAccountDto(
                        v.getAccountId(),
                        v.getBalance(),
                        v.getLastUpdate(),
                        v.getAccountType()

                )
        ).orElseThrow(() ->  new AccountNotFoundException("No Account with id: " + id ));
    }

    public void deleteAccount(Long id) {
        if (accountRepository.existsById(id)) {
            accountRepository.deleteById(id);

            return;
        }
        throw new AccountNotFoundException("Account not found with id: " + id);
    }








}
