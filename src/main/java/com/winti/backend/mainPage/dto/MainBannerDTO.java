package com.winti.backend.mainPage.dto;

import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.entity.ShowAdd;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MainBannerDTO {

    private Long id;
    private String bannerPath;
    private String title;
    private String userId;
    private Long showId;


}
