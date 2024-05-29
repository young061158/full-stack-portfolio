package com.winti.backend.showAdd.controller;

import com.winti.backend.showAdd.dto.RoundDto;
import com.winti.backend.showAdd.service.RoundService;
import kotlin.jvm.internal.Lambda;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/winti/show_add/round")
@CrossOrigin("*")
public class RoundController {
    private final RoundService roundService;

    @PostMapping("/{showAddId}")
    public ResponseEntity<RoundDto> createRound(@PathVariable("showAddId") Long showAddId, @RequestBody RoundDto roundDto) {
        RoundDto createdRound = roundService.createRound(showAddId, roundDto);
        return ResponseEntity.ok(createdRound);
    }

    @PatchMapping("{roundId}")
    public ResponseEntity<RoundDto> updateRound(@PathVariable("roundId") Long id, @RequestBody RoundDto roundDto) {
        RoundDto target = roundService.updateRound(id, roundDto);
        return ResponseEntity.ok(target);
    }

    @DeleteMapping("{roundId}")
    public void deleteRound(@PathVariable("roundId") Long roundId) {
        roundService.deleteRound(roundId);
    }


    @GetMapping("list/{showId}")
    public ResponseEntity<List<RoundDto>> getRoundList(@PathVariable("showId") Long showId) {
        List<RoundDto> targetList = roundService.findRoundList(showId);
        if(!targetList.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(targetList);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

//    @DeleteMapping("/list/{showAddId}")
//    public void deleteRoundList(@PathVariable("showAddId") Long showAddId) {
//        roundService.deleteRoundList(showAddId);
//    }

    @GetMapping("/{showId}/rounds")
    public ResponseEntity<List<RoundDto>> getRoundsByDate(
            @PathVariable Long showId,
            @RequestParam("date") String date) {

        List<RoundDto> rounds = roundService.findRoundsByDate(showId, date);
        return ResponseEntity.ok(rounds);
    }
}
