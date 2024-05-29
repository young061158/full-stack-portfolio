package com.winti.backend.mainPage.controller.upload;


import com.winti.backend.mainPage.service.upload.MainBannerService;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.service.UserService;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.service.ShowAddService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = ("http://localhost:3000"))
public class MainBannerUploadController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MainBannerUploadController.class);

    @Value("${upload.dir}")
    private String uploadDir;
    @Autowired
    private MainBannerService mainBannerService;

    @Autowired
    private UserService userService;

    @Autowired
    private ShowAddService showAddService;

    @PostMapping("/api/bannerUpload")
    public String processUpload(@RequestParam("userId") String userId, @RequestParam("file") MultipartFile file, @RequestParam("title") String title, @RequestParam("showInfo") Long showId) {
        if (file.isEmpty()) {
            return "Please select a file to upload";
        }

        try {
            ShowAdd showAdd = showAddService.getShowById(showId).toEntity();
            UserEntity userEntity = userService.getUserById(userId); // userId로 UserEntity를 조회하는 서비스 로직
            byte[] bytes = file.getBytes();
            Path path = Paths.get(uploadDir + file.getOriginalFilename());
            Files.write(path, bytes);

            mainBannerService.uploadMainBanner(showAdd, userEntity, title, file.getOriginalFilename());
            mainBannerService.updateShowInfoBanner(showId,userEntity,title,true);

            return "You successfully uploaded '" + file.getOriginalFilename() + "'";
        } catch (Exception e) {
            LOGGER.error("Error occurred {}", e.toString());
            return "An Error Occurred " + e.toString();
        }
    }

    @PostMapping("/api/bannerDelete")
    public String processDelete(@RequestParam("userId") String userId,
                                @RequestParam("title") String title,
                                @RequestParam("showInfo") Long showId) {
        try {
            UserEntity userEntity = userService.getUserById(userId); // userId로 UserEntity를 조회하는 서비스 로직
            // 메인 배너 삭제를 위한 서비스 메서드 호출
            mainBannerService.deleteMainBanner(userEntity, title);

            // 메인 배너와 관련된 정보를 업데이트하는 서비스 메서드 호출
            mainBannerService.updateShowInfoBanner(showId,userEntity,title,false);

            return "Successfully deleted banner with title '" + title + "'";
        } catch (Exception e) {
            LOGGER.error("Error occurred during banner deletion: {}", e.toString());
            return "An error occurred during banner deletion: " + e.toString();
        }
    }

    @PostMapping("/api/bannerUpdate")
    public String processUpdate(@RequestParam("userId") String userId,
                                @RequestParam("title") String title,
                                @RequestParam("file") MultipartFile file) {
        try {
            UserEntity userEntity = userService.getUserById(userId); // userId로 UserEntity를 조회하는 서비스 로직
            byte[] bytes = file.getBytes();
            Path path = Paths.get(uploadDir + file.getOriginalFilename());
            Files.write(path, bytes);
            // 메인 배너 업데이트를 위한 서비스 메서드 호출
            mainBannerService.updateMainBanner(userEntity, title, file, file.getOriginalFilename());

            return "Successfully updated banner with title '" + title + "'";
        } catch (Exception e) {
            LOGGER.error("Error occurred during banner update: {}", e.toString());
            return "An error occurred during banner update: " + e.toString();
        }
    }
}
