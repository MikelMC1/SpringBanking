package com.example.demo.advicer;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.sql.Timestamp;

@Data
public class ErrorDTO {
    private String message;
    private HttpStatus status;
    private Timestamp timestamp =  new Timestamp(System.currentTimeMillis());
}
