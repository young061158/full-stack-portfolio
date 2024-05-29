package com.winti.backend.show.payment.dto;

import com.winti.backend.showAdd.dto.SeatDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class SeatSelectionDto {
    private Long paymentId;
    private List<SeatDto> seats;
    private String selectedDate;
    private String address;
    private String name;
    private List<String> selectedSeats;

}
