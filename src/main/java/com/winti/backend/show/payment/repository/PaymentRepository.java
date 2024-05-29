package com.winti.backend.show.payment.repository;

import com.winti.backend.show.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PaymentRepository extends JpaRepository<Payment,Long> {



    Payment findPaymentByPaymentId(Long paymentId);



    List<Payment> findByUser_UserId(String  userId);



}




