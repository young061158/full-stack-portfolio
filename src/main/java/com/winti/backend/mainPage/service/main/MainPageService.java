package com.winti.backend.mainPage.service.main;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.winti.backend.mainPage.dto.MainBannerDTO;
import com.winti.backend.mainPage.dto.MainPageDTO;
import com.winti.backend.mainPage.entity.MainBanner;
import com.winti.backend.mainPage.mapper.ShowInfoMapper;
import com.winti.backend.mainPage.repository.MainBannerRepository;
import com.winti.backend.mainPage.repository.MainPageRepository;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.service.UserService;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.repository.ShowAddRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MainPageService {
    @Autowired
    @Qualifier("mainPageRepository")
    private MainPageRepository mainPageRepository;

    @Autowired
    @Qualifier("mainBannerRepository")
    private MainBannerRepository mainBannerRepository;

    @Autowired
    @Qualifier("showAddRepository")
    private ShowAddRepository showAddRepository;

    @Autowired
    private UserService userService;

    public List<MainBannerDTO> getBanners() {
        return mainBannerRepository.findBannerInfo();
    }

    public List<MainPageDTO> getPerformancesByUserIdAndTitleAndBanner(String userId, String title, Long showId) {
        UserEntity userEntity = userService.getUserById(userId);
        List<ShowAdd> showInfos = mainPageRepository.findByUserEntityAndTitleAndBannerAndShowId(userEntity, title, true, showId);
        return showInfos.stream().map(ShowInfoMapper::convertToShowDTO).collect(Collectors.toList());
    }

    public List<MainBannerDTO> getPerformancesByUserIdAndTitle(String userId, String title) {
        UserEntity userEntity = userService.getUserById(userId);
        Optional<MainBanner> showInfos = mainBannerRepository.findByUserEntityAndTitle(userEntity, title);
        return showInfos.stream().map(ShowInfoMapper::convertToMainBannerDTO).collect(Collectors.toList());
    }

    public List<MainPageDTO> getRecentShows() {
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        List<ShowAdd> showInfos = mainPageRepository.findAllByStartDateAfterOrderByCreateDate(oneMonthAgo);
        return showInfos.stream().map(ShowInfoMapper::convertToShowDTO).collect(Collectors.toList());
    }

    public MainPageDTO getTodayHotByCategory(String category) {
        ShowAdd showInfo = mainPageRepository.findTopByCategoryOrderByViewTodayCountDesc(category);
        return ShowInfoMapper.convertToShowDTO(showInfo);
    }

    public List<MainPageDTO> getWeeklyHotPerformancesByCategory(String category) {
        List<ShowAdd> showInfos = mainPageRepository.findTop10ByCategoryOrderByViewWeekCountDesc(category);
        return showInfos.stream().map(ShowInfoMapper::convertToShowDTO).collect(Collectors.toList());
    }

    public List<MainPageDTO> getCategoryPerformances(String category) {
        List<ShowAdd> showInfos;
        if("All".equals(category)){
            showInfos = mainPageRepository.findAll();
        } else {
            showInfos = mainPageRepository.findAllByCategory(category);
        }
        return showInfos.stream().map(ShowInfoMapper::convertToShowDTO).collect(Collectors.toList());
    }

    public List<MainPageDTO> searchPerformances(String query) {
        List<ShowAdd> showInfos = mainPageRepository.findByTitleContaining(query);
        return showInfos.stream().map(ShowInfoMapper::convertToShowDTO).collect(Collectors.toList());
    }

    public MainPageDTO getPerformanceById(Long id) {
        Optional<ShowAdd> optionalShowInfo = mainPageRepository.findById(id);
        ShowAdd ShowAdd = optionalShowInfo.orElseThrow(() -> new EntityNotFoundException("ShowInfo not found with id: " + id));
        return ShowInfoMapper.convertToShowDTO(ShowAdd);
    }

    public void increaseViewCount(Long showId) {
        Optional<ShowAdd> optionalShowAdd = showAddRepository.findById(showId);
        if (optionalShowAdd.isPresent()) {
            ShowAdd showAdd = optionalShowAdd.get();
            showAdd.upViewCount();
            showAddRepository.save(showAdd);
        } else {
            throw new EntityNotFoundException("ShowAdd not found with id: " + showId);
        }
    }
}
