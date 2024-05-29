package com.winti.backend.member.provider;


import com.winti.backend.member.entity.RefreshToken;
import com.winti.backend.member.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKey;
    private Keys keys;
    private Set<String> blacklist = new HashSet<>();

    public String create(String userId) {
        Date expiredDate = Date.from(Instant.now().plus(2, ChronoUnit.HOURS));
      //Date expiredDate = Date.from(Instant.now().plus(10, ChronoUnit.SECONDS));
        Key key = keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));


        String jwt = Jwts.builder()
                .signWith(key , SignatureAlgorithm.HS256)
                .setSubject(userId).setIssuedAt(new Date()).setExpiration(expiredDate)
                .compact();

        return jwt;
    }

    public String createRefreshToken(String userId) {
        // 리프레쉬 토큰의 만료 시간을 설정합니다.
        Date expirationDate = Date.from(Instant.now().plus(7, ChronoUnit.DAYS)); // 예시로 7일로 설정

        // 리프레쉬 토큰을 생성하기 위해 시크릿 키를 사용합니다.
        Key key = keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        // 리프레쉬 토큰을 생성합니다.
        String refreshToken = Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(expirationDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return refreshToken;
    }

    public String validate (String jwt){

        String subject = null;
        Key key = keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        try{
                subject = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody()
                    .getSubject();

        }catch (Exception exception){
            exception.printStackTrace();
            return null;
        }
        return subject;
    }

    public String resolveTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public void invalidateToken(String token) {
        // 토큰을 파싱하여 만료 시간을 가져옵니다.
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                .build()
                .parseClaimsJws(token)
                .getBody();

        // 토큰의 만료 시간을 현재 시간으로 설정합니다.
        claims.setExpiration(new Date());
        // 새로운 토큰을 생성하지 않고, 기존 토큰을 수정하여 무효화합니다.
    }

    public void addToBlacklist(String jwt) {
        blacklist.add(jwt); // 토큰을 블랙리스트에 추가하여 유효성 검사 시 무효 처리
    }

    public String extractUserId(String jwt) {
        // 토큰에서 클레임을 추출합니다.
        Claims claims = extractClaims(jwt);
        // 추출한 클레임에서 사용자 아이디를 가져옵니다.
        String userId = claims.getSubject();
        return userId;
    }
    private Claims extractClaims(String jwt) {
        // 토큰의 시그니처를 확인하여 클레임을 추출합니다.
        Key key = keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        return claims;
    }


}
