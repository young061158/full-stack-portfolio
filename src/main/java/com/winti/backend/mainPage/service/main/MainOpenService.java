package com.winti.backend.mainPage.service.main;


import com.winti.backend.mainPage.dto.MainPageDTO;
import com.winti.backend.mainPage.mapper.ShowInfoMapper;
import com.winti.backend.mainPage.repository.MainPageRepository;
import com.winti.backend.showAdd.entity.ShowAdd;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MainOpenService {

    @Autowired
    private final MainPageRepository showInfoRepository;

    public List<MainPageDTO> getAllMovies() {
        List<ShowAdd> mainPages = showInfoRepository.findAll();
        return mainPages.stream().map(ShowInfoMapper::convertToShowDTO).collect(Collectors.toList());
    }
}