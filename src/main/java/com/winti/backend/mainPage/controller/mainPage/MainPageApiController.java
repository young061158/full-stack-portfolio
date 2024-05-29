package com.winti.backend.mainPage.controller.mainPage;


import com.winti.backend.mainPage.dto.MainBannerDTO;
import com.winti.backend.mainPage.dto.MainPageDTO;
import com.winti.backend.mainPage.service.main.MainPageService;
import com.winti.backend.member.service.UserService;
import com.winti.backend.show.showdetails.dto.PerformanceWithActorDTO;
import com.winti.backend.showAdd.dto.ActorDto;
import com.winti.backend.showAdd.service.ActorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class MainPageApiController {

    @Autowired
    private MainPageService mainPageService;
    @Autowired
    private UserService userService;

    @Autowired
    private ActorService actorService;

    // 배너슬라이더
    @GetMapping("/banner")
    public ResponseEntity<List<MainBannerDTO>> getBanner() {
        List<MainBannerDTO> banners = mainPageService.getBanners();
        return new ResponseEntity<>(banners, HttpStatus.OK);
    }
    
    //배너 등록페이지에서 배너사진 찾기
    @GetMapping("/banner/find")
    public ResponseEntity<List<MainBannerDTO>> getPerformanceByUserIdAndTitle(@RequestParam("userId") String userId, @RequestParam("title") String title) {
        List<MainBannerDTO> performances = mainPageService.getPerformancesByUserIdAndTitle(userId, title);
        if (!performances.isEmpty()) {
            return new ResponseEntity<>(performances, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //배너슬라이더와 상세보기 연결
    @GetMapping("/performances/byTitle")
    public ResponseEntity<List<MainPageDTO>> getPerformancesByUserIdAndTitleAndBanner(@RequestParam("userId") String userId, @RequestParam("title") String title, @RequestParam("showId") Long showId) {
        List<MainPageDTO> performances = mainPageService.getPerformancesByUserIdAndTitleAndBanner(userId,title, showId);
        if (!performances.isEmpty()) {
            return new ResponseEntity<>(performances, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //open슬라이더
    @GetMapping("/open")
    public ResponseEntity<List<MainPageDTO>> getRecentShows() {
        List<MainPageDTO> recentShows = mainPageService.getRecentShows();
        return new ResponseEntity<>(recentShows, HttpStatus.OK);
    }

    //금일인기
    @GetMapping("/todayHot")
    public ResponseEntity<MainPageDTO> getTodayHotByCategory(@RequestParam("category") String category) {
        MainPageDTO todayHotPerformance = mainPageService.getTodayHotByCategory(category);
        return new ResponseEntity<>(todayHotPerformance, HttpStatus.OK);
    }
    
    //주간인기
    @GetMapping("/weeklyHot")
    public ResponseEntity<List<MainPageDTO>> getWeeklyHotPerformancesByCategory(@RequestParam("category") String category) {
        List<MainPageDTO> weeklyHotPerformances = mainPageService.getWeeklyHotPerformancesByCategory(category);
        return new ResponseEntity<>(weeklyHotPerformances, HttpStatus.OK);
    }
    
    //카테고리별 공연
    @GetMapping("/performances")
    public ResponseEntity<List<MainPageDTO>> getCategoryPerformances(@RequestParam("category") String category) {
        List<MainPageDTO> categoryPerformances = mainPageService.getCategoryPerformances(category);
        return new ResponseEntity<>(categoryPerformances, HttpStatus.OK);
    }

    //검색
    @GetMapping("/search")
    public ResponseEntity<List<MainPageDTO>> searchPerformances(@RequestParam("query") String query) {
        List<MainPageDTO> searchResults = mainPageService.searchPerformances(query);
        return new ResponseEntity<>(searchResults, HttpStatus.OK);
    }

    //공연 상세보기
    @GetMapping("/performances/{id}")
    public ResponseEntity<PerformanceWithActorDTO> getPerformanceById(@PathVariable("id") Long id) {
        MainPageDTO performance = mainPageService.getPerformanceById(id);
        List<ActorDto> actorDto = actorService.getActorList(performance.getShowid());

        // 조회수 증가 메서드 호출
        mainPageService.increaseViewCount(id);

        PerformanceWithActorDTO response = PerformanceWithActorDTO.builder()
                .performance(performance)
                .actor(actorDto)
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
