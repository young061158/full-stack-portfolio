package com.winti.backend.showAdd.service;

import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.dto.ShowAddDto;
import com.winti.backend.showAdd.entity.Actor;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.repository.ActorRepository;
import com.winti.backend.showAdd.repository.ShowAddRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class ShowAddService {

    @Value("${upload.dir}")
    private String uploadDir;

    private final ShowAddRepository showAddRepository;

    private void uploadFiles(List<MultipartFile> files) throws IOException {
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            byte[] bytes = file.getBytes();
            String fileName = file.getOriginalFilename(); // 고유한 파일 이름 생성
            Path path = Paths.get(uploadDir + fileName);
            Files.write(path, bytes);
        }
    }

    public ShowAddDto createShow(UserEntity userId, String title, String subTitle, String startDate, String endDate, String category, String runTime, String showAddress, String showSubAddress, String showAge, String bank, String account, String discriptionText, MultipartFile discriptionImg, String caveats, MultipartFile[] posterPath, int tiketLimit) throws IOException {
        LocalDateTime createDate = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);

        // 설명 이미지 및 포스터 이미지 업로드

        ShowAdd showAdd = new ShowAdd();
        showAdd.setUserEntity(userId);
        showAdd.setTitle(title);
        showAdd.setSubTitle(subTitle);
        showAdd.setStartDate(LocalDate.parse(startDate));
        showAdd.setEndDate(LocalDate.parse(endDate));
        showAdd.setCategory(category);
        showAdd.setRunTime(runTime);
        showAdd.setShowAddress(showAddress);
        showAdd.setShowSubAddress(showSubAddress);
        showAdd.setShowAge(showAge);
        showAdd.setBank(bank);
        showAdd.setAccount(account);
        showAdd.setDiscriptionText(discriptionText);
        showAdd.setCaveats(caveats);
        showAdd.setDiscriptionImg("/images/"+ discriptionImg.getOriginalFilename());
        showAdd.setViewTodayCount(0);
        showAdd.setViewWeekCount(0);
        showAdd.setTicketLimit(tiketLimit);
        showAdd.setCreateDate(createDate);
        showAdd.setBanner(false);
        showAdd.setLifeCycle(false);

        uploadFiles(Collections.singletonList(discriptionImg));

        for (int i = 0; i < posterPath.length; i++) {
            uploadFiles(Collections.singletonList(posterPath[i])); // posterPath[i]를 리스트로 만들어 전달
            switch (i) {
                case 0:
                    showAdd.setPosterPath1("/images/"+ posterPath[i].getOriginalFilename());
                    break;
                case 1:
                    showAdd.setPosterPath2("/images/"+ posterPath[i].getOriginalFilename());
                    break;
                case 2:
                    showAdd.setPosterPath3("/images/"+ posterPath[i].getOriginalFilename());
                    break;
                default:
                    // 배열의 길이가 3을 초과하는 경우에 대한 처리
                    break;
            }
        }

        showAddRepository.save(showAdd);
        return showAdd.toDto();
    }

    public ShowAddDto getShowById(Long showId) {
        try {
            ShowAdd showAdd = showAddRepository.findById(showId)
                    .orElseThrow(() -> new EntityNotFoundException("ShowAdd not found with id: " + showId));
            return showAdd.toDto();
        } catch (EntityNotFoundException e) {
            log.error("Entity not found: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("An unexpected error occurred", e);
            return null;
        }
    }

    public ShowAddDto updateShow(Long showId, String userId, String title, String subTitle, String startDate, String endDate, String category, String showAge, String discriptionText, MultipartFile discriptionImg, String caveats) throws IOException {
        ShowAdd showUpdate = showAddRepository.findById(showId).orElseThrow();
        if (!showUpdate.getUserEntity().getUserId().equals(userId)) {
            return null;
        }

        LocalDateTime updateDate = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        // 설명 이미지 및 포스터 이미지 업로드

        showUpdate.setTitle(title);
        showUpdate.setSubTitle(subTitle);
        showUpdate.setStartDate(LocalDate.parse(startDate));
        showUpdate.setEndDate(LocalDate.parse(endDate));
        showUpdate.setCategory(category);
        showUpdate.setShowAge(showAge);
        showUpdate.setDiscriptionText(discriptionText);
        showUpdate.setCaveats(caveats);
        showUpdate.setDiscriptionImg("/images/" + discriptionImg.getOriginalFilename());
        showUpdate.setUpdateDate(updateDate);

        uploadFiles(Collections.singletonList(discriptionImg));

        showAddRepository.save(showUpdate);
        return showUpdate.toDto();
    }

    public void deleteShow(Long showId){
        ShowAdd target = showAddRepository.findById(showId)
                .orElseThrow(() -> new EntityNotFoundException("ShowAdd not found with id: " + showId));
        if(target != null){
            showAddRepository.delete(target);
        }
    }
}