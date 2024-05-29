package com.winti.backend.showAdd.repository;

import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.entity.ShowAdd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository("showAddRepository")
public interface ShowAddRepository extends JpaRepository<ShowAdd, Long> {

    @Modifying
    @Query("UPDATE ShowAdd sa SET sa.viewTodayCount = 0")
    void resetDailyViewCount();

    @Modifying
    @Query("UPDATE ShowAdd sa SET sa.viewWeekCount = 0")
    void resetWeeklyViewCount();

    List<ShowAdd> findByUserEntity(UserEntity userId);

}
