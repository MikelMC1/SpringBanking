package com.example.demo.repository;

import com.example.demo.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);



    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password, u.updateDate = CURRENT_TIMESTAMP WHERE u.id = :id")
    int updatePassword(@Param("id") Long id, @Param("password") String password);



}

