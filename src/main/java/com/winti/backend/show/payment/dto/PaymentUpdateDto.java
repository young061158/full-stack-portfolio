package com.winti.backend.show.payment.dto;

import com.winti.backend.show.payment.entity.PayStatus;
import com.winti.backend.showAdd.entity.Seat;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentUpdateDto {
    private Long paymentId;
    private BigDecimal amount;
    private Seat seating;
    private String buyerTel;
    private String buyerEmail;
    private String card_name;
    private String card_number;
    private PayStatus status;
    private String  paid_at;
}
