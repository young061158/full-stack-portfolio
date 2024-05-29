package com.winti.backend.showAdd.controller;

import com.winti.backend.mainPage.controller.upload.MainBannerUploadController;
import com.winti.backend.showAdd.dto.ActorDto;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.service.ActorService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/winti/show_add")
@CrossOrigin("*")
public class ActorController {
    private final ActorService actorService;

    @Value("${upload.dir}")
    private String uploadDir;

    private static final Logger LOGGER = LoggerFactory.getLogger(MainBannerUploadController.class);


    @PostMapping("/actor")
    public ResponseEntity<ActorDto> createActor(@RequestParam("showId") ShowAdd showId,
                                                @RequestParam("actorName") String actorNames,
                                                @RequestParam("characterName") String characterNames,
                                                @RequestParam("actorPath") MultipartFile actorPath) {
        try {
            ActorDto actorDto = actorService.createActor(showId,actorNames,characterNames,actorPath);
            return ResponseEntity.status(HttpStatus.CREATED).body(actorDto);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // 또는 오류 메시지를 포함할 수 있습니다.
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // 또는 오류 메시지를 포함할 수 있습니다.
        }
    }

    @GetMapping("actor/{showId}")
    public ResponseEntity<List<ActorDto>> getActorList(@PathVariable("showId") Long showId) {
        try {
            List<ActorDto> actorList = actorService.getActorList(showId);
            if (actorList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else {
                return ResponseEntity.status(HttpStatus.OK).body(actorList);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // 또는 오류 메시지를 포함할 수 있습니다.
        }
    }
}