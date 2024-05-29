package com.winti.backend.showAdd.controller;

import com.winti.backend.mainPage.controller.upload.MainBannerUploadController;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.dto.ActorDto;
import com.winti.backend.showAdd.dto.ShowAddDto;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.service.ShowAddService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/winti/show_add")
@CrossOrigin("*")
public class ShowAddController {
    private final ShowAddService showAddService;

    @Value("${upload.dir}")
    private String uploadDir;

    private static final Logger LOGGER = LoggerFactory.getLogger(MainBannerUploadController.class);

    @PostMapping("/show_add")
    public ResponseEntity<ShowAddDto> createShow(   @RequestParam("userId") UserEntity userId,
                                                    @RequestParam("title") String title,
                                                    @RequestParam("subTitle") String subTitle,
                                                    @RequestParam("startDate") String startDate,
                                                    @RequestParam("endDate") String endDate,
                                                    @RequestParam("category") String category,
                                                    @RequestParam("runTime") String runTime,
                                                    @RequestParam("showAddress") String showAddress,
                                                    @RequestParam("showSubAddress") String showSubAddress,
                                                    @RequestParam("showAge") String showAge,
                                                    @RequestParam("bank") String bank,
                                                    @RequestParam("account") String account,
                                                    @RequestParam("discriptionText") String discriptionText,
                                                    @RequestParam("discriptionImg") MultipartFile discriptionImg,
                                                    @RequestParam("caveats") String caveats,
                                                    @RequestParam("posterPath") MultipartFile[] posterPath,
                                                    @RequestParam("ticketLimit") int ticketLimit
                                                    ) {
        try {
            ShowAddDto savedShow = showAddService.createShow(userId,title,subTitle,startDate,endDate,category,runTime,showAddress,showSubAddress,showAge, bank,account,discriptionText,discriptionImg,caveats,posterPath ,ticketLimit);
            return new ResponseEntity<>(savedShow, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/{showId}")
    public ResponseEntity<ShowAddDto> getShowById(@PathVariable Long showId) {
        ShowAddDto show = showAddService.getShowById(showId);
        if (show != null) {
            return new ResponseEntity<>(show, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PatchMapping("modify/{showId}")
    public ResponseEntity<ShowAddDto> updateShow(   @PathVariable("showId") Long showId,
                                                    @RequestParam("userId") String userId,
                                                    @RequestParam("title") String title,
                                                    @RequestParam("subTitle") String subTitle,
                                                    @RequestParam("startDate") String startDate,
                                                    @RequestParam("endDate") String endDate,
                                                    @RequestParam("category") String category,
                                                    @RequestParam("showAge") String showAge,
                                                    @RequestParam("discriptionText") String discriptionText,
                                                    @RequestParam("discriptionImg") MultipartFile discriptionImg,
                                                    @RequestParam("caveats") String caveats
    ) {
        try {
            ShowAddDto savedShow = showAddService.updateShow(showId, userId,title,subTitle,startDate,endDate,category,showAge, discriptionText,discriptionImg,caveats);
            return new ResponseEntity<>(savedShow, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("error/{showId}")
    public ResponseEntity<String> errorDelete(@PathVariable("showId") Long showId) {
        showAddService.deleteShow(showId);
        return ResponseEntity.ok("Show deleted successfully");
    }
}