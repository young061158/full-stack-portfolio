package com.winti.backend.showAdd.dto;

import com.winti.backend.showAdd.entity.Round;
import com.winti.backend.showAdd.entity.Seat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatDto {
    private Long seatId;
    private Long roundId;
    private String seatName;
    private int colSeat;
    private int rowSeat;
    private String seatClass;
    private int seatAmount;
    private Boolean reserved;
    
    public Seat toEntity() {
        Seat seat = new Seat();
        seat.setId(this.seatId);

        Round round = new Round();
        round.setRoundId(this.roundId);
        seat.setRound(round);

        seat.setSeatName(this.seatName);
        seat.setColSeat(this.colSeat);
        seat.setRowSeat(this.rowSeat);
        seat.setSeatClass(this.seatClass);
        seat.setSeatAmount(this.seatAmount);
        seat.setReserved(this.reserved != null ? this.reserved : false);

        return seat;
    }

    public static SeatDto fromEntity(Seat seat) {
        SeatDto dto = new SeatDto();
        dto.setSeatId(seat.getId());
        dto.setRoundId(seat.getRound().getRoundId());
        dto.setSeatName(seat.getSeatName());
        dto.setColSeat(seat.getColSeat());
        dto.setRowSeat(seat.getRowSeat());
        dto.setSeatClass(seat.getSeatClass());
        dto.setSeatAmount(seat.getSeatAmount());
        dto.setReserved(seat.isReserved());
        return dto;
    }
}
