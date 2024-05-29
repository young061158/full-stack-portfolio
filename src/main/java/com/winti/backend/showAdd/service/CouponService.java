package com.winti.backend.showAdd.service;


import com.winti.backend.showAdd.dto.CouponDto;
import com.winti.backend.showAdd.entity.Coupon;
import com.winti.backend.showAdd.entity.ShowAdd;
import com.winti.backend.showAdd.repository.CouponRepository;
import com.winti.backend.showAdd.repository.ShowAddRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;
    private final ShowAddRepository showAddRepository;

    public CouponDto createCoupon(Long showId, CouponDto couponDto) {
        Coupon coupon = couponDto.toEntity();
        ShowAdd showAdd = showAddRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("ShowAdd not found id : " + showId));
        coupon.setShowAdd(showAdd);
        couponRepository.save(coupon);
        return coupon.toDto();
    }

    public List<CouponDto> findCouponList(Long showId) {
        List<Coupon> couponList = couponRepository.findAll();
        return couponList.stream()
                .filter(coupon -> coupon.getShowAdd().getShowId().equals(showId))
                .map(Coupon::toDto)
                .collect(Collectors.toList());
    }

    // public CouponDto updateCoupon(Long id, CouponDto couponDto) {
    //     Coupon coupon = couponDto.toEntity();
    //     Coupon target = couponRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Coupon not found id : " + id));
    //     if (target.getCouponId() == null || !target.getCouponId().equals(coupon.getCouponId())) {
    //         return null;
    //     }
    //     couponRepository.save(coupon);
    //     return coupon.toDto();
    // }

    public void deleteCoupon(Long couponId) {
        couponRepository.deleteById(couponId);
    }
}
