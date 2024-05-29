package com.winti.backend.mainPage.repository;


import com.winti.backend.mainPage.dto.MainBannerDTO;
import com.winti.backend.mainPage.entity.MainBanner;
import com.winti.backend.member.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("mainBannerRepository")
public interface MainBannerRepository extends JpaRepository<MainBanner, Integer> {
    Optional<MainBanner> findByUserEntityAndTitle(UserEntity userEntity, String title);
    void deleteByUserEntityAndTitle(UserEntity userEntity, String title);

    @Query("SELECT new com.winti.backend.mainPage.dto.MainBannerDTO(b.id, b.bannerPath, b.title, b.userEntity.id, b.showAdd.id) FROM MainBanner b")
    List<MainBannerDTO> findBannerInfo();

}
