package com.winti.backend.showAdd.repository;

import com.winti.backend.showAdd.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByPayment_paymentId(Long paymentId);
}
