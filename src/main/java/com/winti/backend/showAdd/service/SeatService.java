package com.winti.backend.showAdd.service;

import com.winti.backend.showAdd.dto.SeatDto;
import com.winti.backend.showAdd.entity.Round;
import com.winti.backend.showAdd.entity.Seat;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.repository.RoundRepository;
import com.winti.backend.showAdd.repository.SeatRepository;
import com.winti.backend.showAdd.repository.ShowAddRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {
    private final SeatRepository seatRepository;
    private final RoundRepository roundRepository;
    private final ShowAddRepository showAddRepository;

    public List<SeatDto> createSeat(Long roundId,SeatDto[] seatDto) {
        Round round =roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found id : " + roundId));

        List<SeatDto> stage = new ArrayList();

        for(SeatDto s:seatDto){
            Seat seat = s.toEntity();
            seat.setRound(round);
            seatRepository.save(seat);
            stage.add(seat.toDto());
        }
        return stage;
    }

    public List<SeatDto> findSampleStage(Long showId) {
        ShowAdd show = showAddRepository.findById(showId)
                .orElseThrow(() -> new EntityNotFoundException("Show not found id: " + showId));

        Long roundSample = show.getRoundList().get(0).getRoundId();

        List<Seat> stage = seatRepository.findAll();
        if (stage != null) {
            return stage.stream()
                    .filter(s -> s.getRound().getRoundId() == roundSample)
                    .map(Seat::toDto)
                    .toList();
        } else {
            return Collections.emptyList(); // 또는 다른 적절한 대체값을 반환
        }
    }


    public List<SeatDto> findSeatList(Long roundId) {
        List<Seat> stage = seatRepository.findAll();
        return stage.stream()
                .filter(seat -> seat.getRound().getRoundId().equals(roundId))
                .map(Seat::toDto)
                .toList();
    }

    public List<SeatDto> findSeatpriceList(Long paymentId) {
        List<Seat> seats = seatRepository.findByPayment_paymentId(paymentId);
        return seats.stream()
                .map(Seat::toDto)
                .toList();
    }


    public SeatDto updateSeat(Long id, SeatDto seatDto) {
        Seat target = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found id : " + id));
        if (target.getId() == null || !id.equals(seatDto.getSeatId())) {
            return null;
        }
        target.setReserved(seatDto.getReserved());
        seatRepository.save(target);
        return target.toDto();
    }

    public void deleteSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found id : " + seatId));
        seatRepository.delete(seat);
    }

    public void deleteStage(Long showId) {
        List<Seat> stage = seatRepository.findAll();
        stage.stream()
                .filter(seat -> seat.getRound().getShowAdd().getShowId().equals(showId))
                .toList();
        seatRepository.deleteAll(stage);
    }
}