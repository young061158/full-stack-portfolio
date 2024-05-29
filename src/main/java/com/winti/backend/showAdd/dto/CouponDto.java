package com.winti.backend.showAdd.dto;


import com.winti.backend.showAdd.entity.Coupon;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponDto {
    private Long couponId;
    private Long showId;
    private String showTitle;
    private String couponName;
    private String couponCode;
    private int discount;
    private boolean isPermit;
    
    public Coupon toEntity(){
        return Coupon.builder()
                .couponId(this.couponId)
                .couponName(this.couponName)
                .couponCode(this.couponCode)
                .discount(this.discount)
                .isPermit(this.isPermit)
                .build();
    }
}
