package com.winti.backend.showAdd.entity;


import com.winti.backend.mainPage.entity.MainBanner;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.dto.ShowAddDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "show_add")
public class ShowAdd {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "show_id")
    private Long showId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserEntity userEntity;

    @Column(name = "title", nullable = false, length = 20)
    private String title;

    @Column(name = "sub_title", nullable = false, length = 50)
    private String subTitle;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "run_time")
    private String runTime;

    @Column(name = "show_address", nullable = false)
    private String showAddress;

    @Column(name = "show_sub_address", nullable = false)
    private String showSubAddress;

    @Column(name = "bank_name", nullable = false)
    private String bank;

    @Column(name = "account", nullable = false)
    private String account;

    @Column(name = "show_age", nullable = false)
    private String showAge;

    @Column(name = "discription_text", nullable = false)
    private String discriptionText;

    @Column(name = "discription_img", nullable = false)
    private String discriptionImg;

    @Column(name = "caveats", nullable = false)
    private String caveats;

    @Transient
    private String posterPath;

    @Column(name = "poster_path1", nullable = false)
    private String posterPath1;

    @Column(name = "poster_path2", nullable = true)
    private String posterPath2;

    @Column(name = "poster_path3", nullable = true)
    private String posterPath3;

    @Column(name = "view_count")
    private int viewCount;

    @Column(name = "view_today_count")
    private int viewTodayCount;

    @Column(name = "view_week_count")
    private int viewWeekCount;

    @Column(name = "ticket_limit", nullable = false)
    private int ticketLimit;

    @Column(name = "life_cycle",nullable = false)
    @Builder.Default
    private boolean lifeCycle = false;

    @Column(name = "banner", nullable = false)
    @Builder.Default
    private boolean banner = false;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "update_date" )
    private LocalDateTime updateDate;

    @OneToMany(mappedBy = "showAdd", cascade = CascadeType.ALL)
    private List<Actor> actorList;

    @OneToMany(mappedBy = "showAdd", cascade = CascadeType.ALL)
    private List<Round> roundList;

    @OneToMany(mappedBy = "showAdd", cascade = CascadeType.ALL)
    private List<Coupon> couponList;

    @OneToMany(mappedBy = "showAdd", cascade = CascadeType.ALL)
    private List<MainBanner> mainBanners;

    //== 조회수 증가 ==//
    public void upViewCount() {
        this.viewCount++;
        this.viewTodayCount++;
        this.viewWeekCount++;
    }

    public ShowAddDto toDto() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return ShowAddDto.builder()
                .showId(this.showId)
                .uploaderId(this.userEntity.getUserId())
                .title(this.title)
                .subTitle(this.subTitle)
                .startDate(this.startDate.format(formatter))
                .endDate(this.endDate.format(formatter))
                .category(this.category)
                .runTime(this.runTime)
                .showAddress(this.showAddress)
                .showSubAddress(this.showSubAddress)
                .showAge(this.showAge)
                .bank(this.bank)
                .account(this.account)
                .discriptionText(this.discriptionText)
                .discriptionImg(this.discriptionImg)
                .caveats(this.caveats)
                .posterPath1(this.posterPath1)
                .posterPath2(this.posterPath2)
                .posterPath3(this.posterPath3)
                .ticketLimit(this.ticketLimit)
                .createDate(this.createDate)
                .updateDate(this.updateDate)
                .viewTodayCount(this.viewTodayCount)
                .viewWeekCount(this.viewWeekCount)
                .banner(this.banner)
                .lifeCycle(this.lifeCycle)
                .build();
    }
}