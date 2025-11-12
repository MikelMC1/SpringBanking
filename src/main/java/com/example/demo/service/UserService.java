package com.example.demo.service;

import com.example.demo.dtos.CreateUserDto;
import com.example.demo.dtos.GetAccountDto;
import com.example.demo.dtos.GetUserDTO;
import com.example.demo.entity.User;
import com.example.demo.exceptions.UserNotFoundException;
import com.example.demo.mapper.CreateUserMapper;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CreateUserMapper createUserMapper;
    private final PasswordEncoder passwordEncoder;


    public User createUser(CreateUserDto dto) {
        User user = createUserMapper.toUser(dto);

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return userRepository.save(user);
    }


    public List<GetUserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new GetUserDTO(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPassword(),
                        user.getCreateDate(),
                        user.getUpdateDate(),
                        user.getAccounts()
                                .stream()
                                .map(account -> new GetAccountDto(
                                        account.getAccountId(),
                                        account.getBalance(),
                                        account.getLastUpdate(),
                                        account.getAccountType()
                                ))
                                .toList()
                ))
                .toList();
    }



    public GetUserDTO getUserById(Long id) throws Exception {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.map(
                v -> new GetUserDTO(
                      v.getId(),
                      v.getFullName(),
                      v.getEmail(),
                      v.getPassword(),
                        v.getCreateDate(),
                        v.getUpdateDate(),
                        v.getAccounts().stream().map(
                                a -> new GetAccountDto(
                                        a.getAccountId(),
                                        a.getBalance(),
                                        a.getLastUpdate(),
                                        a.getAccountType()
                                )
                        ).toList()
                )
        ).orElseThrow(() ->  new UserNotFoundException("No user found"));
    }



    public GetUserDTO getUserByEmail(String email) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.map(
                v -> new GetUserDTO(
                        v.getId(),
                        v.getFullName(),
                        v.getEmail(),
                        v.getPassword(),
                        v.getCreateDate(),
                        v.getUpdateDate(),
                        v.getAccounts().stream().map(
                                a -> new GetAccountDto(
                                        a.getAccountId(),
                                        a.getBalance(),
                                        a.getLastUpdate(),
                                        a.getAccountType()
                                )
                        ).toList()
                )
        ).orElseThrow(() ->  new UserNotFoundException("No user found"));
    }

    public void updatePassword(Long id, String newPassword) {
        int updatedRows = userRepository.updatePassword(id, newPassword);
        if (updatedRows == 0) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
    }


    public void deleteUser(Long id) {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                return;
            }
        throw new UserNotFoundException("User not found with id: " + id);

    }




}
