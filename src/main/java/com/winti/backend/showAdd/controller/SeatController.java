package com.winti.backend.showAdd.controller;

import com.winti.backend.showAdd.dto.SeatDto;
import com.winti.backend.showAdd.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/winti/show_add/seats")
@CrossOrigin("*")
public class SeatController {
    private final SeatService seatService;

    @PostMapping("{roundId}")
    public ResponseEntity<List<SeatDto>> createSeat(@PathVariable("roundId") Long roundId , @RequestBody SeatDto[] seatDto) {
        List<SeatDto> stage = seatService.createSeat(roundId, seatDto);
        return ResponseEntity.ok(stage);
    }

    @GetMapping("sample/{showId}")
    public ResponseEntity<List<SeatDto>> getSampleStage(@PathVariable("showId") Long showId) {
        List<SeatDto> stage = seatService.findSampleStage(showId);

        return ResponseEntity.status(HttpStatus.OK).body(stage);
    }


    @GetMapping("{roundId}")
    public ResponseEntity<List<SeatDto>> getStage(@PathVariable("roundId") Long roundId) {
        List<SeatDto> stage = seatService.findSeatList(roundId);
        return ResponseEntity.ok(stage);
    }

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<List<SeatDto>> getSeatsByPaymentId(@PathVariable("paymentId") Long paymentId) {
        List<SeatDto> seats = seatService.findSeatpriceList(paymentId);
        return ResponseEntity.ok(seats);
    }

    @PatchMapping("{id}")
    public ResponseEntity<SeatDto> updateSeat(@PathVariable Long seatId, @RequestBody SeatDto seatDto) {
        SeatDto seat = seatService.updateSeat(seatId, seatDto);
        return ResponseEntity.ok(seat);
    }

//    @DeleteMapping("{id}")
//    public void deleteSeat(@PathVariable Long seatId) {
//        seatService.deleteSeat(seatId);
//    }

    @DeleteMapping("/stage/{id}")
    public void deleteStage(@PathVariable Long showId) {
        seatService.deleteStage(showId);
    }
}