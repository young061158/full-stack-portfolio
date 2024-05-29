package com.winti.backend.mainPage.mapper;


import com.winti.backend.mainPage.dto.MainBannerDTO;
import com.winti.backend.mainPage.dto.MainPageDTO;
import com.winti.backend.mainPage.entity.MainBanner;
import com.winti.backend.showAdd.entity.ShowAdd;


public class ShowInfoMapper {

//    public static ShowAdd mapToShowInfo(MainPageDTO mainPageDTO){
//        return new ShowAdd(
//                mainPageDTO.getShowid(),
//                mainPageDTO.getUserId(),
//                mainPageDTO.getTitle(),
//                mainPageDTO.getStartDate(),
//                mainPageDTO.getEndDate(),
//                mainPageDTO.getPosterPath1(),
//                mainPageDTO.getCategory(),
//                mainPageDTO.getSubtitle(),
//                mainPageDTO.getViewTodayCount(),
//                mainPageDTO.getViewWeekCount(),
//                mainPageDTO.isBanner(),
//                mainPageDTO.getCreateDate()
//        );
//    }


    public static MainPageDTO convertToShowDTO(ShowAdd showAdd) {
        MainPageDTO dto = new MainPageDTO();
        dto.setShowid(showAdd.getShowId());
        dto.setUserId(showAdd.getUserEntity().getUserId());
        dto.setTitle(showAdd.getTitle());
        dto.setSubTitle(showAdd.getSubTitle());
        dto.setStartDate(showAdd.getStartDate());
        dto.setEndDate(showAdd.getEndDate());
        dto.setCategory(showAdd.getCategory());
        dto.setRunTime(showAdd.getRunTime());
        dto.setShowAddress(showAdd.getShowAddress());
        dto.setShowSubAddress(showAdd.getShowSubAddress());
        dto.setShowAge(showAdd.getShowAge());
        dto.setBank(showAdd.getBank());
        dto.setAccount(showAdd.getAccount());
        dto.setDiscriptionText(showAdd.getDiscriptionText());
        dto.setDiscriptionImg(showAdd.getDiscriptionImg());
        dto.setCaveats(showAdd.getCaveats());
        dto.setPosterPath1(showAdd.getPosterPath1());
        dto.setPosterPath2(showAdd.getPosterPath2());
        dto.setPosterPath3(showAdd.getPosterPath3());
        dto.setViewTodayCount(showAdd.getViewTodayCount());
        dto.setViewWeekCount(showAdd.getViewWeekCount());
        dto.setBanner(showAdd.isBanner());
        dto.setTicketLimit(showAdd.getTicketLimit());
        dto.setCreateDate(showAdd.getCreateDate());

        // 날짜를 문자열로 변환하여 설정
        dto.setStartDateString(showAdd.getStartDate().toString());
        dto.setEndDateString(showAdd.getEndDate().toString());
        dto.setCreateDateString(showAdd.getCreateDate().toString());

        return dto;
    }

    public static MainBanner mapToMainBanner(MainBannerDTO mainBannerDTO) {
        MainBanner mainBanner = new MainBanner();
        mainBanner.setId(mainBannerDTO.getId());
        mainBanner.setBannerPath(mainBannerDTO.getBannerPath());
//        mainBanner.setUserEntity(mainBannerDTO.getUserId());
        ShowAdd showAdd = new ShowAdd();
        showAdd.setShowId(mainBannerDTO.getShowId());
        mainBanner.setTitle(mainBannerDTO.getTitle());

        return mainBanner;
    }

    public static MainBannerDTO convertToMainBannerDTO(MainBanner mainBanner) {
        MainBannerDTO mainBannerDTO = new MainBannerDTO();
        mainBannerDTO.setId(mainBanner.getId());
        mainBannerDTO.setBannerPath(mainBanner.getBannerPath());
        mainBannerDTO.setUserId(mainBanner.getUserEntity().getUserId());
        mainBannerDTO.setShowId(mainBanner.getShowAdd().getShowId());
        mainBannerDTO.setTitle(mainBanner.getTitle());

        return mainBannerDTO;
    }
}