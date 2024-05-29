package com.winti.backend.mainPage.service.upload;

import com.winti.backend.mainPage.entity.MainBanner;
import com.winti.backend.mainPage.repository.MainBannerRepository;
import com.winti.backend.mainPage.repository.MainPageRepository;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.entity.ShowAdd;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;


@Service
public class MainBannerService {

    @Autowired
    @Qualifier("mainPageRepository")
    private MainPageRepository mainPageRepository;

    @Autowired
    @Qualifier("mainBannerRepository")
    private MainBannerRepository mainBannerRepository;

    @Transactional
    public void uploadMainBanner(ShowAdd showId, UserEntity userEntity, String title, String filename) {
        MainBanner mainBanner = new MainBanner();
        mainBanner.setShowAdd(showId);
        mainBanner.setUserEntity(userEntity);
        mainBanner.setTitle(title);
        mainBanner.setBannerPath("/images/" + filename);
        mainBannerRepository.save(mainBanner);
    }

    @Transactional
    public void updateShowInfoBanner(Long showId, UserEntity userEntity, String title, boolean banner) {
        Optional<ShowAdd> optionalShowInfo = mainPageRepository.findByShowIdAndUserEntityAndTitle(showId, userEntity, title);
        optionalShowInfo.ifPresent(showInfo -> {
            showInfo.setBanner(banner);
            mainPageRepository.save(showInfo);
        });
    }

    @Transactional
    public void deleteMainBanner(UserEntity userEntity, String title) {
        mainBannerRepository.deleteByUserEntityAndTitle(userEntity, title);
    }
    @Transactional
    public void updateMainBanner(UserEntity userId, String title, MultipartFile file, String filename) {
        // 해당 userId와 title을 가진 MainBanner를 조회합니다.
        Optional<MainBanner> optionalMainBanner = mainBannerRepository.findByUserEntityAndTitle(userId, title);

        // MainBanner가 존재하면 파일을 업데이트하고 저장합니다.
        optionalMainBanner.ifPresent(mainBanner -> {
            try {
                if (file != null && !file.isEmpty()) {
                    String newFileName = saveFile(file);
                    mainBanner.setBannerPath("/images/" + filename);
                }
                mainBannerRepository.save(mainBanner);
            }
            catch (IOException e) {
                // 파일 저장 중 에러 발생 시 처리 로직을 추가할 수 있습니다.
//                throw new FileStorageException("Failed to store file", e);
            }
        });
    }

    // 파일 저장을 처리하는 메서드
    private String saveFile(MultipartFile file) throws IOException {
        // 파일 저장 로직을 구현하여 파일을 저장하고 파일명을 반환합니다.
        // 이 부분은 프로젝트에 맞게 파일 시스템이나 클라우드 저장소에 파일을 저장하는 방식으로 수정해야 합니다.
        return "new_file_name.jpg"; // 저장된 파일명 반환 예시
    }
}