package com.winti.backend.show.payment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.show.payment.dto.PaymentDto;
import com.winti.backend.showAdd.entity.Seat;
import com.winti.backend.showAdd.entity.ShowAdd;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;
    private String merchantUid;
    private BigDecimal amount;
    private String name;
    private String address;
    private String buyerTel;
    private String buyerEmail;
    private PayStatus status;
    private String buyerName;
    private String card_name;
    private String card_number;
    private String poster_path1;
    private String selectedDate;
    private LocalDateTime paid_at;

    @ElementCollection
    private List<String> selectedSeats;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Seat> seating;

    @ManyToOne(fetch = FetchType.EAGER)
    private ShowAdd showAdd;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    @JsonIgnore
    private UserEntity user;

    LocalDateTime payDate = LocalDateTime.now();

    @Transient
    private LocalDateTime parsedSelectedDate;

    // Initialize parsedSelectedDate in constructor
    public Payment() {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            this.parsedSelectedDate = LocalDateTime.parse(this.selectedDate, formatter);
        } catch (Exception e) {
            this.parsedSelectedDate = null;
        }
    }

    public void changePaymentBySuccess(PayStatus status, LocalDateTime payDate) {
        this.status = status;
        this.paid_at = payDate;
    }

    public PaymentDto toDto() {
        PaymentDto dto = new PaymentDto();
        dto.setPaymentId(this.paymentId);
        dto.setMerchantUid(this.merchantUid);
        dto.setAmount(this.amount);
        dto.setName(this.name);
        dto.setAddress(this.address);
        dto.setBuyerTel(this.buyerTel);
        dto.setBuyerEmail(this.buyerEmail);
        dto.setStatus(PayStatus.valueOf(this.status.toString()));
        dto.setBuyerName(this.buyerName);
        dto.setCard_name(this.card_name);
        dto.setCard_number(this.card_number);
        dto.setPosterPath1(this.poster_path1);

        // Format LocalDateTime to yyyy-MM-dd HH:mm
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        dto.setSelectedDate(this.selectedDate);  // Assuming selectedDate is already a string
        dto.setPayDate(this.payDate);

        // Convert LocalDateTime to formatted string
        dto.setPayDateString(this.payDate.format(formatter));

        // Assuming selectedDate is a string and needs formatting, you can parse it to LocalDateTime first
        try {
            LocalDateTime selectedDateTime = LocalDateTime.parse(this.selectedDate, formatter);
            dto.setSelectedDate(selectedDateTime.format(formatter));
        } catch (Exception e) {
            dto.setSelectedDate(this.selectedDate);
        }

        dto.setSelectedSeats(this.selectedSeats);
        dto.setShowId(this.showAdd.getShowId());
        dto.setUserId(this.user.getUserId());

        return dto;
    }

    public LocalDateTime getParsedSelectedDate() {
        return parsedSelectedDate;
    }

    public void setParsedSelectedDate(LocalDateTime parsedSelectedDate) {
        this.parsedSelectedDate = parsedSelectedDate;
    }
}
