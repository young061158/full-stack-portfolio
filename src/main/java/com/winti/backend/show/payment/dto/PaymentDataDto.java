package com.winti.backend.show.payment.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDataDto {
    private Long id;
    private String merchantUid;
    private int amount;
    private String itemName;
    private String area;
    private String buyerName;
    private String buyerTel;
    private LocalDate startDate;
    private String seating;
    private String title;
    private String buyerEmail;

    PaymentDataDto paymentDataDto = PaymentDataDto.builder()

            .merchantUid(getMerchantUid())
            .amount(getAmount())
            .title(getTitle())
            .area(getArea())
            .buyerName(getBuyerName())
            .buyerTel(getBuyerTel())
            .startDate(getStartDate())
            .seating(getSeating()).build();
}
