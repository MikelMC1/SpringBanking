package com.example.demo.controller;

import com.example.demo.dtos.CreateUserDto;
import com.example.demo.dtos.GetUserDTO;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @PostMapping("/user")
    public User createUser(@Valid @RequestBody CreateUserDto dto) {
        return userService.createUser(dto);
    }

    @GetMapping("/user/{id}")
    public GetUserDTO getUser(@PathVariable Long id) throws Exception {
        return userService.getUserById(id);
    }

    @GetMapping("/users")
    public List<GetUserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    @GetMapping("/user/email/{email}")
    public GetUserDTO getUserByEmail(@PathVariable String email) throws Exception {
        return userService.getUserByEmail(email);
    }


    @PatchMapping("/user/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newPassword = request.get("password");
        userService.updatePassword(id, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }
















}
