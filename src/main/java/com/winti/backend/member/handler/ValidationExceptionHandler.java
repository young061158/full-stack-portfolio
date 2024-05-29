package com.winti.backend.member.handler;

import com.winti.backend.member.dto.response.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler({MethodArgumentNotValidException.class , HttpMessageNotReadableException.class})
    public ResponseEntity<ResponseDto> validationExceptionHendler(Exception exception){
        return ResponseDto.validationFail();
    }

}
