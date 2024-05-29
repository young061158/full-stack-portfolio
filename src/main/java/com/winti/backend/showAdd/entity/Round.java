package com.winti.backend.showAdd.entity;


import com.winti.backend.showAdd.dto.RoundDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "round")
public class Round {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "round_id")
    private Long roundId;

    @ManyToOne
    @JoinColumn(name = "show_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ShowAdd showAdd;

    @Column(name = "round_time", nullable = false)
    private LocalDateTime roundDateTime;

    @OneToMany(mappedBy = "round", cascade = CascadeType.ALL)
    @Column(nullable = false)
    private List<Seat> stage;

    public RoundDto toDto() {
        DateTimeFormatter formatterDate = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter formatterTime = DateTimeFormatter.ofPattern("HH:mm");

        return RoundDto.builder()
                .roundId(this.roundId)
                .roundDate(this.roundDateTime.format(formatterDate))
                .roundTime(this.roundDateTime.format(formatterTime))
                .showTitle(this.showAdd.getTitle())
                .showId(this.showAdd.getShowId())
                .build();
    }
}