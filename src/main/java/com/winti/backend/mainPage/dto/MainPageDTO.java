package com.winti.backend.mainPage.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MainPageDTO {

    private Long showid;
    private String userId;
    private String title;
    private String subTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private String category;
    private String runTime;
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

    // 문자열 형태의 날짜 필드 추가
    private String startDateString;
    private String endDateString;
    private String createDateString;

    // 기간이 지났는지 확인하는 메소드
    public boolean isPeriodExpired() {
        LocalDate currentDate = LocalDate.now();
        return currentDate.isAfter(endDate);
    }
}
