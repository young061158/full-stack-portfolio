package com.winti.backend.showAdd.dto;


import com.winti.backend.showAdd.entity.Round;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoundDto {
    private Long roundId;
    private Long showId;
    private String showTitle;
    private String roundDate;
    private String roundTime;

    public Round toEntity() {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        LocalDate date = LocalDate.parse(this.roundDate, dateFormatter);
        LocalTime time = LocalTime.parse(this.roundTime, timeFormatter);

        return Round.builder()
                .roundId(this.roundId)
                .roundDateTime(LocalDateTime.of(date, time))
                .build();
    }
}