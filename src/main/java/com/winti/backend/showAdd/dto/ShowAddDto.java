package com.winti.backend.showAdd.dto;


import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.entity.ShowAdd;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowAddDto {

    private Long showId;
    private String uploaderId;
    private String title;
    private String subTitle;
    private String startDate;
    private String endDate;
    private String category;
    private String  runTime;
    private String showAddress;
    private String showSubAddress;
    private String showAge;
    private String bank;
    private String account;
    private String discriptionText;
    private String discriptionImg;
    private String caveats;
    private String posterPath;
    private String posterPath1;
    private String posterPath2;
    private String posterPath3;
    private int viewTodayCount;
    private int viewWeekCount;
    private int ticketLimit;
    @Builder.Default
    private boolean lifeCycle = false;
    @Builder.Default
    private boolean banner = false;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public ShowAdd toEntity() {
        return ShowAdd.builder()
                .showId(this.showId)
                .startDate(LocalDate.parse(this.startDate))
                .endDate(LocalDate.parse(this.endDate))
                .category(this.category)
                .title(this.title)
                .subTitle(this.subTitle)
                .posterPath1(this.posterPath1)
                .posterPath2(this.posterPath2)
                .posterPath3(this.posterPath3)
                .showAddress(this.showAddress)
                .showSubAddress(this.showSubAddress)
                .runTime(this.runTime)
                .bank(this.bank)
                .account(this.account)
                .discriptionText(this.discriptionText)
                .discriptionImg(this.discriptionImg)
                .caveats(this.caveats)
                .ticketLimit(this.ticketLimit)
                .build();
    }
}