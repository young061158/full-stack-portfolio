package com.winti.backend.member.repository;


import com.winti.backend.member.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
@Repository
public interface TokenRepository extends JpaRepository<RefreshToken, Long> {

    RefreshToken findByRefreshToken(String refreshToken);

    void deleteByCreatedAtBefore(Date date);

}
