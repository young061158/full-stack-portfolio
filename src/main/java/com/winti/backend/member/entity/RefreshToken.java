package com.winti.backend.member.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Date;

@Getter
@NoArgsConstructor
@Entity(name = "token")
@Table(name ="token")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;

    public RefreshToken(String refreshToken){
        this.refreshToken = refreshToken;
    }


}
