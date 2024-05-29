package com.winti.backend.member.service;

import com.winti.backend.member.repository.TokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;

@Component
public class TokenCleanupScheduler {

    private final TokenRepository tokenRepository;

    public TokenCleanupScheduler(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Scheduled(cron = "0 0 0 * * *") // 매일 자정에 실행
    @Transactional
    public void cleanupExpiredTokens() {
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        Date sevenDaysAgoSql = Date.valueOf(sevenDaysAgo); // LocalDate를 java.sql.Date로 변환
        tokenRepository.deleteByCreatedAtBefore(sevenDaysAgoSql);
    }
}