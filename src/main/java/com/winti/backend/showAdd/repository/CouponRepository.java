package com.winti.backend.showAdd.repository;

import com.winti.backend.showAdd.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
}
