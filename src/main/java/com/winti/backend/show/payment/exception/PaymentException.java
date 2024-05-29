package com.winti.backend.show.payment.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "entity not found")
public class PaymentException extends RuntimeException{
    public PaymentException(String message){
        super(message);
    }

}
