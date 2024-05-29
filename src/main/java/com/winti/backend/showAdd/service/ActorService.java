package com.winti.backend.showAdd.service;

import com.beust.ah.A;
import com.winti.backend.mainPage.mapper.ShowInfoMapper;
import com.winti.backend.showAdd.dto.ActorDto;
import com.winti.backend.showAdd.entity.Actor;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.repository.ActorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActorService {
    private final ActorRepository actorRepository;

    @Value("${upload.dir}")
    private String uploadDir;

    private void uploadFiles(List<MultipartFile> files) throws IOException {
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            byte[] bytes = file.getBytes();
            String fileName = file.getOriginalFilename(); // 고유한 파일 이름 생성
            Path path = Paths.get(uploadDir + fileName);
            Files.write(path, bytes);
        }
    }

    public ActorDto createActor(ShowAdd showId, String actorName, String characterName, MultipartFile multipartFile) throws IOException {
        Actor actor = new Actor();
        actor.setShowAdd(showId);
        actor.setActorName(actorName);
        actor.setCharacterName(characterName);
        actor.setActorPath("/images/"+ multipartFile.getOriginalFilename());

        uploadFiles(Collections.singletonList(multipartFile));
        actorRepository.save(actor);

        return actor.toDto();
    }

    public ActorDto getActorById(Long showid) {
        Optional<Actor> optionalShowInfo = actorRepository.findById(showid);
        Actor actor = optionalShowInfo.orElseThrow(() -> new EntityNotFoundException("ShowInfo not found with id: " + showid));
        return actor.toDto();
    }

    public List<ActorDto> getActorList(Long showId) {
        return actorRepository.findAll().stream()
                .filter(actor -> actor.getShowAdd() != null && actor.getShowAdd().getShowId().equals(showId))
                .map(Actor::toDto)
                .toList();
    }
}