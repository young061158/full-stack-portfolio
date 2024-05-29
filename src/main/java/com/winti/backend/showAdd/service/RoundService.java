package com.winti.backend.showAdd.service;

import com.winti.backend.showAdd.dto.RoundDto;
import com.winti.backend.showAdd.entity.Round;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.repository.RoundRepository;
import com.winti.backend.showAdd.repository.ShowAddRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoundService {
    private final RoundRepository roundRepository;
    private final ShowAddRepository showAddRepository;
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    private final ZoneId kstZoneId = ZoneId.of("Asia/Seoul");

    @Transactional
    public RoundDto createRound(Long showAddId, RoundDto roundDto) {
        Round round = roundDto.toEntity();

        ShowAdd showAdd = showAddRepository.findById(showAddId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 공연을 찾을 수 없습니다."));

        boolean isSameRoundExists = showAdd.getRoundList().stream()
                .anyMatch(r -> r.getRoundDateTime().equals(round.getRoundDateTime()));

        if (isSameRoundExists) {
            return null;
        }

        round.setShowAdd(showAdd);
        roundRepository.save(round);

        return round.toDto();
    }

    // 쇼 아이디에 해당 전체 출력
    public List<RoundDto> findRoundList(Long showId) {
        return roundRepository.findAll().stream()
                .filter(round -> round.getShowAdd() != null && round.getShowAdd().getShowId().equals(showId))
                .map(Round::toDto)
                .toList();
    }

    // round 수정
    @Transactional
    public RoundDto updateRound(Long id, RoundDto roundDto) {
        Round target = roundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Round not found id : " + id));

        if (!id.equals(roundDto.getRoundId())) {
            return null;
        }
        target.setRoundDateTime(LocalDateTime.of(LocalDate.parse(roundDto.getRoundDate()), LocalTime.parse(roundDto.getRoundTime())));
        Round round = roundRepository.save(target);
        return round.toDto();
    }

    // round 삭제
    public void deleteRound(Long roundId) {
        Round round = roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found id : " + roundId));
        roundRepository.delete(round);
    }

    // 쇼 아이디 해당 전체 삭제
    // public void deleteRoundList(Long showId) {
    //     List<Round> roundList = roundRepository.findAll();
    //     roundList.stream()
    //             .filter(round -> round.getShowAdd() != null && round.getShowAdd().getShowId().equals(showId))
    //             .toList();
    //     roundRepository.deleteAll(roundList);
    // }

    public List<RoundDto> findRoundsByDate(Long showId, String date) {
        Optional<ShowAdd> showOptional = showAddRepository.findById(showId);

        if (showOptional.isPresent()) {
            ZonedDateTime zonedDateTime = ZonedDateTime.parse(date, dateTimeFormatter).withZoneSameInstant(ZoneId.of("Asia/Seoul"));
            LocalDate localDate = zonedDateTime.toLocalDate();
            return roundRepository.findAll().stream()
                    .filter(round -> round.getShowAdd() != null
                            && round.getShowAdd().getShowId().equals(showId)
                            && round.getRoundDateTime().toLocalDate().equals(localDate))
                    .map(Round::toDto)
                    .collect(Collectors.toList());
        } else {
            throw new EntityNotFoundException("Show not found for id: " + showId);
        }
    }
}