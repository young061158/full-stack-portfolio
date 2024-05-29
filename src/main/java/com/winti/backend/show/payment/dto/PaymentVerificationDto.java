package com.winti.backend.show.payment.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class PaymentVerificationDto {

    private String merchantUid;
    private BigDecimal amount;
    private String payment_uid;



    public PaymentVerificationDto(String merchantUid, BigDecimal amount) {
        this.merchantUid = merchantUid;
        this.amount = amount;

    }
}
