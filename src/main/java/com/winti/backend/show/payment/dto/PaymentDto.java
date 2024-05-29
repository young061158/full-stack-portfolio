package com.winti.backend.show.payment.dto;


import com.winti.backend.show.payment.entity.PayStatus;
import com.winti.backend.showAdd.dto.SeatDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PaymentDto {
    private Long paymentId;
    private String merchantUid;
    private BigDecimal amount;
    private String name;
    private String address;
    private String buyerTel;
    private String buyerEmail;
    private PayStatus status;
    private String buyerName;
    private String card_name;
    private String card_number;
    private String posterPath1;
    private String selectedDate;
    private List<String> selectedSeats;
    private List<SeatDto> seating;
    private String userId;
    private LocalDateTime payDate;
    private Long showId;

    // 문자열 형태의 날짜 필드 추가
    private String payDateString;

}
