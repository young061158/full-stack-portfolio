package com.winti.backend.showAdd.entity;


import com.winti.backend.showAdd.dto.CouponDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coupon")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Long couponId;

    @ManyToOne
    @JoinColumn(name = "show_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ShowAdd showAdd;

    @Column(nullable = false)
    private String couponName;
    @Column(nullable = false)
    private String couponCode;
    @Column(nullable = false)
    private int discount;
    @Builder.Default
    private boolean isPermit = true;

    @OneToOne

    public CouponDto toDto(){
        return CouponDto.builder()
                .couponId(this.couponId)
                .showId(this.showAdd.getShowId())
                .showTitle(this.showAdd.getTitle())
                .couponName(this.couponName)
                .couponCode(this.couponCode)
                .discount(this.discount)
                .isPermit(this.isPermit)
                .build();
    }
}
