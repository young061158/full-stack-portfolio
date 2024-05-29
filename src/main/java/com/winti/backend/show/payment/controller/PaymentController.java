package com.winti.backend.show.payment.controller;

import com.siot.IamportRestClient.IamportClient;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.provider.JwtProvider;
import com.winti.backend.member.repository.UserRepository;
import com.winti.backend.show.payment.dto.*;
import com.winti.backend.show.payment.entity.PayStatus;
import com.winti.backend.show.payment.entity.Payment;
import com.winti.backend.show.payment.service.PaymentService;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.repository.ShowAddRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/payment")
@Slf4j
public class PaymentController {

   private final PaymentService paymentService;

   private final IamportClient api;
   private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

   private final ShowAddRepository showAddRepository;

   private final UserRepository userRepository;

   private final JwtProvider jwtProvider ;



   //사용자ID로 결제내역 전체조회
   @GetMapping("/user/{userId}")
   public ResponseEntity<List<PaymentDto>> getPaymentsByUserId(@PathVariable("userId") String userId) {
      try {
         List<PaymentDto> payments = paymentService.getPaymentsByUserId(userId);
         return ResponseEntity.ok(payments);
      } catch (EntityNotFoundException e) {
         return ResponseEntity.notFound().build();
      } catch (Exception e) {
         return ResponseEntity.internalServerError().body(null);
      }
   }
//사용자ID로 결제내역 단건조회
   @GetMapping("/user/detail/{paymentId}")
   public ResponseEntity<PaymentDto>getPaymentInfo(@PathVariable("paymentId") Long paymentId){
      try {
         PaymentDto paymentDto = paymentService.getPaymentInfo(paymentId);
         return ResponseEntity.ok(paymentDto);
      } catch (EntityNotFoundException e){
         return ResponseEntity.notFound().build();
      }
   }

//결제 내역 저장
@PostMapping("/create")
public ResponseEntity<?> createPayment(@RequestBody PaymentDto paymentDto, @RequestHeader("Authorization") String authHeader) {
   try {
      String jwt = authHeader.substring(7);
      String userId = jwtProvider.extractUserId(jwt);

      UserEntity user = userRepository.findByUserId(userId);

      paymentDto.setUserId(user.getUserId());
      paymentDto.setBuyerName(user.getUsername());

      ShowAdd showAdd = showAddRepository.findById(paymentDto.getShowId())
              .orElseThrow(() -> new EntityNotFoundException("Show not found with id: " + paymentDto.getShowId()));

      // 결제 정보 저장
      Payment payment = new Payment();
      payment.setMerchantUid(paymentDto.getMerchantUid());
      payment.setAmount(paymentDto.getAmount());
      payment.setName(paymentDto.getName());
      payment.setAddress(paymentDto.getAddress());
      payment.setBuyerTel(paymentDto.getBuyerTel());
      payment.setBuyerEmail(paymentDto.getBuyerEmail());
      payment.setStatus(PayStatus.READY);
      payment.setPoster_path1(paymentDto.getPosterPath1());
      payment.setBuyerName(paymentDto.getBuyerName());
      payment.setCard_name(paymentDto.getCard_name());
      payment.setCard_number(paymentDto.getCard_number());
      payment.setSelectedDate(paymentDto.getSelectedDate());
      payment.setShowAdd(showAdd);
      payment.setUser(user);

      Payment savedPayment = paymentService.savePayment(payment, user.getUserId());

      return ResponseEntity.ok(Map.of("paymentId", savedPayment.getPaymentId()));
   } catch (UsernameNotFoundException e) {
      logger.error("Error finding user: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
   } catch (Exception e) {
      logger.error("Internal server error: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
   }
}
   //가격저장
   @PutMapping("/update")
   public ResponseEntity<?>updatePaymentInfo(@RequestBody PaymentUpdateDto paymentUpdateDto) {
      try {
         Payment payment = paymentService.updatePayment(paymentUpdateDto);

         return ResponseEntity.ok(payment);
      } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청입니다."+e.getMessage());
      }
   }
   @DeleteMapping("/delete/{paymentId}")
   public ResponseEntity<?> deletePayment(@PathVariable Long paymentId, @RequestHeader("Authorization") String authHeader) {
      try {
         String jwt = authHeader.substring(7);
         String userId = jwtProvider.extractUserId(jwt);

         // Perform the deletion
         paymentService.deletePayment(paymentId, userId);

         return ResponseEntity.ok("Payment deleted successfully");
      } catch (EntityNotFoundException e) {
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
      } catch (AccessDeniedException e) {
         return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
      } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
      }
   }

   //좌석정보 DB저장
   @PostMapping("/save-seating")
   public PaymentDto saveReservation(@RequestBody SeatSelectionDto seatSelectionDto) {
      logger.info("Received SeatSelectionDto: {}", seatSelectionDto);
      return paymentService.saveReservation(seatSelectionDto);
   }




   //결제 데이터 가져오기
   @GetMapping("/paymentData/{paymentId}")
   public ResponseEntity<?> paymentInfoData(@PathVariable("paymentId") Long paymentId) {
      try {
        Payment paymentData = paymentService.getPaymentData(paymentId);
         PaymentDto paymentDto = paymentData.toDto();

         return ResponseEntity.ok(paymentDto);
      } catch (Exception e) {
         // Logging the error can be helpful for debugging
         log.error("Error retrieving payment data for id {}: {}", paymentId, e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                 .body("An error occurred while fetching payment data.");
      }
   }
   //결제 사전검증
   @PostMapping("/prepare/{paymentId}")
   public ResponseEntity<?> preparePaymentVerification(@PathVariable("paymentId") Long paymentId) {
      try {
         Optional<Payment> optionalPayment = paymentService.findById(paymentId);
         if (!optionalPayment.isPresent()) {
            log.warn("Payment not found for ID: {}", paymentId);
            return ResponseEntity.notFound().build();
         }

         Payment payment = optionalPayment.get();
         String paymentPrepareResponse = paymentService.preparePayment(payment);
         PaymentVerificationDto verificationDto = createVerificationDto(payment);

         ResponseEntity<String> response = paymentService.verifyPayment(verificationDto);
         if (response.getStatusCode().is2xxSuccessful()) {
            log.info("Payment verification successful for ID: {}", paymentId);
            return ResponseEntity.ok().body(new PaymentResponse(true, "Payment verification successful."));
         } else {
            log.warn("Payment verification failed for ID: {}. Response Status: {}", paymentId, response.getStatusCode());
            return ResponseEntity.status(response.getStatusCode()).body(new PaymentResponse(false, "Payment verification failed."));
         }
      } catch (Exception e) {
         log.error("An error occurred during payment verification for ID: {}", paymentId, e);
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new PaymentResponse(false, "An error occurred: " + e.getMessage()));
      }
   }

   private PaymentVerificationDto createVerificationDto(Payment payment) {
      return new PaymentVerificationDto(payment.getMerchantUid(), payment.getAmount());
   }


}