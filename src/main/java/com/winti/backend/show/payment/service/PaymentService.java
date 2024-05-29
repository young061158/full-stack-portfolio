package com.winti.backend.show.payment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.siot.IamportRestClient.IamportClient;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.repository.UserRepository;
import com.winti.backend.show.payment.dto.PaymentDto;
import com.winti.backend.show.payment.dto.PaymentUpdateDto;
import com.winti.backend.show.payment.dto.PaymentVerificationDto;
import com.winti.backend.show.payment.dto.SeatSelectionDto;
import com.winti.backend.show.payment.entity.PayStatus;
import com.winti.backend.show.payment.entity.Payment;
import com.winti.backend.show.payment.repository.PaymentRepository;
import com.winti.backend.showAdd.dto.SeatDto;
import com.winti.backend.showAdd.entity.Seat;
import com.winti.backend.showAdd.repository.SeatRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;

    private final IamportClient iamportClient;

    private final TokenService tokenService;

    private final UserRepository userRepository;

    private final RestTemplate restTemplate;

    private  final SeatRepository seatRepository;
    @Value("${portone.api.key}")
    private String apiKey;

    @Value("${portone.api.secret}")
    private String apiSecret;



    public List<PaymentDto> getPaymentsByUserId(String userId) {
        List<Payment> payments = paymentRepository.findByUser_UserId(userId);

        if (payments.isEmpty()) {
            throw new EntityNotFoundException("No payments found for User ID: " + userId);
        }

        return payments.stream().map(this::convertToDto).collect(Collectors.toList());
    }
    public PaymentDto getPaymentInfo(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for ID: " + paymentId));
        return convertToDto(payment);
    }



    public Payment updatePayment(PaymentUpdateDto paymentUpdateDto) {
        Payment payment = paymentRepository.findPaymentByPaymentId(paymentUpdateDto.getPaymentId());

        if (paymentUpdateDto.getAmount() != null) {
            payment.setAmount(paymentUpdateDto.getAmount());
        }

        if (paymentUpdateDto.getBuyerTel() != null) {
            payment.setBuyerTel(paymentUpdateDto.getBuyerTel());
        }

        if (paymentUpdateDto.getBuyerEmail() != null) {
            payment.setBuyerEmail(paymentUpdateDto.getBuyerEmail());
        }
        if (paymentUpdateDto.getCard_name() != null){
            payment.setCard_name(paymentUpdateDto.getCard_name());
        }
        if (paymentUpdateDto.getCard_number() != null){
            payment.setCard_number(paymentUpdateDto.getCard_number());
        }



       payment.changePaymentBySuccess(PayStatus.OK, payment.getPaid_at());
        return paymentRepository.save(payment);
    }
    private PaymentDto convertToDto(Payment payment) {
        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setPaymentId(payment.getPaymentId());
        paymentDto.setName(payment.getName());
        paymentDto.setAddress(payment.getAddress());
        paymentDto.setMerchantUid(payment.getMerchantUid());
        paymentDto.setBuyerTel(payment.getBuyerTel());
        paymentDto.setBuyerEmail(payment.getBuyerEmail());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setStatus(PayStatus.OK);
        paymentDto.setSelectedSeats(payment.getSelectedSeats());
        paymentDto.setBuyerName(payment.getBuyerName());
        paymentDto.setCard_name(payment.getCard_name());
        paymentDto.setCard_number(payment.getCard_number());
        paymentDto.setPosterPath1(payment.getPoster_path1());
        paymentDto.setSelectedDate(payment.getSelectedDate());



        List<SeatDto> seatDtos = payment.getSeating().stream()
                .map(SeatDto::fromEntity)
                .collect(Collectors.toList());
        paymentDto.setSeating(seatDtos);

        return paymentDto;
    }


public Payment savePayment(Payment payment, String  userId) {
    UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    payment.setUser(user);
    return paymentRepository.save(payment);
}

    public PaymentDto saveReservation(SeatSelectionDto seatSelectionDto) {
        Long paymentId = seatSelectionDto.getPaymentId();
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

        List<Seat> seats = seatSelectionDto.getSeats().stream()
                .map(seatDto -> {
                    Seat seat = seatDto.toEntity();
                    seat.setPayment(payment);
                    return seat;
                })
                .collect(Collectors.toList());

        payment.setSeating(seats);
        payment.setSelectedSeats(seatSelectionDto.getSelectedSeats());
        payment.setSelectedDate(seatSelectionDto.getSelectedDate());
        payment.setAddress(seatSelectionDto.getAddress());
        payment.setName(seatSelectionDto.getName());

        Payment savedPayment = paymentRepository.save(payment);
        return convertToDto(savedPayment);
    }







    public void deletePayment(Long paymentId, String userId) throws AccessDeniedException {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with id: " + paymentId));

        // Check if the user is authorized to delete this payment
        if (!payment.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("User not authorized to delete this payment");
        }

        paymentRepository.delete(payment);
    }




@Transactional
public Payment getPaymentData(Long paymentId ){
   Payment paymentData = paymentRepository.findById(paymentId).orElseThrow(()-> new NullPointerException("결제정보가 없습니다" + paymentId));

   return paymentData;
}
    public String preparePayment(Payment payment) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String requestBody = mapper.writeValueAsString(new HashMap<String, Object>() {{
            put("merchant_uid", payment.getMerchantUid());
            put("amount", payment.getAmount());
        }});

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.iamport.kr/payments/prepare"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }


    public Optional<Payment> findById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public ResponseEntity<String> verifyPayment(PaymentVerificationDto verificationDto) {
        try {
            // 외부 API 호출을 위한 별도 메소드
            String response = callExternalPaymentVerificationApi(verificationDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to verify payment: " + e.getMessage());
        }
    }

    private String callExternalPaymentVerificationApi(PaymentVerificationDto verificationDto) throws IOException, InterruptedException {
        String requestBody = new ObjectMapper().writeValueAsString(verificationDto);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.iamport.kr/payments/prepare"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + tokenService.fetchToken()) // 가정: 토큰이 DTO에 포함
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

}

