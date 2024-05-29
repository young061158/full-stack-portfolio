package com.winti.backend.showAdd.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.show.payment.entity.Payment;
import com.winti.backend.showAdd.dto.SeatDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "seat")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "round_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Round round;
    @Column(nullable = false)
    private String seatName;
    @Column(nullable = false)
    private int colSeat;
    @Column(nullable = false)
    private int rowSeat;
    @Column(nullable = false)
    private String seatClass;

    @Builder.Default
    private int seatAmount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    @JsonIgnore
    private Payment payment;


    @Builder.Default
    @OneToOne
    private UserEntity Consumer = null;

    @Builder.Default
    private boolean isReserved = false;

    public SeatDto toDto() {
        return SeatDto.builder()
                .seatId(id)
                .roundId(round.getRoundId())
                .seatName(seatName)
                .colSeat(colSeat)
                .rowSeat(rowSeat)
                .seatClass(seatClass)
                .seatAmount(seatAmount)
                .reserved(isReserved)
                .build();
    }

}
