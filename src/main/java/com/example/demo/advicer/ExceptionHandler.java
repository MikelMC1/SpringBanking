package com.example.demo.advicer;

import com.example.demo.exceptions.AccountNotFoundException;
import com.example.demo.exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ExceptionHandler {

    @org.springframework.web.bind.annotation.ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorDTO> handleUserNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(buildError(ex.getMessage()), HttpStatus.NOT_FOUND);
    }


    @org.springframework.web.bind.annotation.ExceptionHandler(AccountNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorDTO> handleAccountNotFoundException(AccountNotFoundException ex) {
        return new ResponseEntity<>(buildError(ex.getMessage()), HttpStatus.NOT_FOUND);
    }










    private ErrorDTO buildError(String message) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setMessage(message);
        errorDTO.setStatus(HttpStatus.NOT_FOUND);

        return errorDTO;
    }
}
