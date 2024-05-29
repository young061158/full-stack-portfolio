package com.winti.backend.show.showdetails.service;


import com.winti.backend.mainPage.repository.MainPageRepository;
import com.winti.backend.mainPage.service.main.MainPageService;
import com.winti.backend.showAdd.repository.RoundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShowDetailService {

    private final MainPageRepository mainPageRepository;

    private final RoundRepository roundRepository;

    private final MainPageService mainPageService;


}
