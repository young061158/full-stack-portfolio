package com.winti.backend.show.showdetails.controller;


import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.show.payment.dto.PaymentDto;
import com.winti.backend.show.payment.entity.PayStatus;
import com.winti.backend.show.payment.entity.Payment;
import com.winti.backend.show.payment.repository.PaymentRepository;
import com.winti.backend.show.showdetails.dto.ShowDetailDto;
import com.winti.backend.show.showdetails.dto.ShowDetailUserDto;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.repository.ShowAddRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin("*")
public class ShowDetailController {

    @Autowired
    private ShowAddRepository showAddRepository;

    private final PaymentRepository paymentRepository;

    @GetMapping("/sell/registrations")
    public ResponseEntity<List<ShowDetailDto>> getRegistrations(@RequestParam("userId") UserEntity userId) {
        List<ShowAdd> shows = showAddRepository.findByUserEntity(userId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yy-MM-dd");
        List<ShowDetailDto> registrations = shows.stream()
                .map(show -> new ShowDetailDto(
                        show.getCreateDate().format(formatter),
                        show.getShowId(),
                        show.getTitle(),
                        "등록 완료"
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/buy/registrations")
    public ResponseEntity<List<ShowDetailUserDto>> getBuyRegistration(@RequestParam("userId") String userId) {
        List<Payment> payments = paymentRepository.findByUser_UserId(userId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yy-MM-dd");
        List<ShowDetailUserDto> registrations = payments.stream()
                .map(payment -> new ShowDetailUserDto(
                        payment.getPayDate().format(formatter),
                        payment.getPaymentId(),
                        payment.getName(),
                        "구매 완료"
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/buy/recentShow")
    public ResponseEntity<PaymentDto> getClosestShow(@RequestParam("userId") String userId) {
        List<Payment> payments = paymentRepository.findByUser_UserId(userId);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourLater = now.plusHours(1);

        Payment closestPayment = payments.stream()
                .map(payment -> {
                    String selectedDate = payment.getSelectedDate();
                    if (selectedDate != null) {
                        String selectedDate2 = selectedDate.substring(0, 10) + " " + selectedDate.substring(10);

                        try {
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
                            payment.setParsedSelectedDate(LocalDateTime.parse(selectedDate2, formatter));
                        } catch (Exception e) {
                            payment.setParsedSelectedDate(null);
                        }
                    } else {
                        payment.setParsedSelectedDate(null);
                    }
                    return payment;
                })
                .filter(payment -> {
                    boolean isValid = payment.getParsedSelectedDate() != null;
                    return isValid;
                })
                .filter(payment -> {
                    boolean isAfterNow = payment.getParsedSelectedDate().isAfter(now);
                    return isAfterNow;
                })
                .filter(payment -> {
                    boolean isBeforeOneHourLater = payment.getParsedSelectedDate().isBefore(oneHourLater);
                    return isBeforeOneHourLater;
                })
                .min(Comparator.comparing(Payment::getParsedSelectedDate))
                .orElse(null);

        if (closestPayment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        PaymentDto closestShow = closestPayment.toDto();
        return ResponseEntity.ok(closestShow);
    }


    @GetMapping("/reservation/{reservationShowId}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable("reservationShowId") Long reservationShowId) {
        Payment payment = paymentRepository.findPaymentByPaymentId(reservationShowId);

        if (payment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        PaymentDto paymentDto = payment.toDto();
        return new ResponseEntity<>(paymentDto, HttpStatus.OK);
    }
}
