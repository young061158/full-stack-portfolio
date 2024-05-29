package com.winti.backend.showAdd.controller;


import com.winti.backend.showAdd.dto.CouponDto;
import com.winti.backend.showAdd.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/winti/show_add/coupon")
@CrossOrigin("*")
public class CouponController {
    private final CouponService couponService;

    @PostMapping("{showId}")
    public ResponseEntity<CouponDto> createCoupon(@PathVariable("showId") Long showId, @RequestBody CouponDto couponDto) {
        CouponDto target  = couponService.createCoupon(showId, couponDto);
        return ResponseEntity.ok(target);
    }

    @GetMapping("/{showId}")
    public ResponseEntity<List<CouponDto>> getCouponList(@PathVariable("showId") Long showId) {
        List<CouponDto> targetList = couponService.findCouponList(showId);
        return ResponseEntity.ok(targetList);
    }

//    @PatchMapping("{showId}")
//    public ResponseEntity<CouponDto> updateCoupon(@PathVariable("showId") Long showId, @RequestBody CouponDto couponDto) {
//        CouponDto target = couponService.updateCoupon(showId, couponDto);
//        return ResponseEntity.ok(target);
//    }

    @DeleteMapping("{couponId}")
    public void deleteCoupon(@PathVariable("couponId") Long couponId) {
        couponService.deleteCoupon(couponId);
    }
}
