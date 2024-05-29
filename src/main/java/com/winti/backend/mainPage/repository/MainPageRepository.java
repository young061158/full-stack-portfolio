package com.winti.backend.mainPage.repository;


import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.entity.ShowAdd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository("mainPageRepository")
public interface MainPageRepository extends JpaRepository<ShowAdd, Long> {

    List<ShowAdd> findAllByStartDateAfterOrderByCreateDate(LocalDate oneMonthAgo);

    ShowAdd findTopByCategoryOrderByViewTodayCountDesc(String category);

    List<ShowAdd> findByUserEntityAndTitleAndBannerAndShowId(UserEntity userEntity, String title, boolean banner, Long showId);

    List<ShowAdd> findAllByCategory(String category);

    List<ShowAdd> findTop10ByCategoryOrderByViewWeekCountDesc(String category);

    List<ShowAdd> findByTitleContaining(String query);

    Optional<ShowAdd> findByShowIdAndUserEntityAndTitle(Long showAdd, UserEntity userEntity, String title);


}
