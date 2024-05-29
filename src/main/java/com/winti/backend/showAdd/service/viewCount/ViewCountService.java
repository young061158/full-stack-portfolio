package com.winti.backend.showAdd.service.viewCount;

import com.winti.backend.mainPage.repository.MainPageRepository;
import com.winti.backend.showAdd.repository.ShowAddRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ViewCountService {

    private static final Logger logger1 = LoggerFactory.getLogger(ViewCountService.class);
    private static final Logger logger2 = LoggerFactory.getLogger(ViewCountService.class);

    @Autowired
    @Qualifier("showAddRepository")
    private ShowAddRepository showAddRepository;

    // 매일 자정에 실행
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void resetDailyViewCount() {
        logger1.info("resetDailyViewCount called at {}", LocalDateTime.now());
        showAddRepository.resetDailyViewCount();
    }

    @Scheduled(cron = "0 0 0 * * 4")
    @Transactional
    public void resetWeeklyViewCount() {
        logger2.info("resetWeeklyViewCount called at {}", LocalDateTime.now());
        showAddRepository.resetWeeklyViewCount();
    }

}
