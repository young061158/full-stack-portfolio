package com.winti.backend.member.filter;

import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.provider.JwtProvider;
import com.winti.backend.member.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter  extends OncePerRequestFilter {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try{
            String token = parseBearerToken(request);
            if(token == null){
                filterChain.doFilter(request , response);
                return;
            }
            String userId = jwtProvider.validate(token);
            if(userId == null){
                filterChain.doFilter(request , response);
                return;
            }

            //유저 아이디를 가지고 유저 정보를 꺼내온다.
            UserEntity user = userRepository.findByUserId(userId);
            String role = user.getRole(); // role = ROLE_USER, ROLE_ADMIN , ROLE_SELLER

            logger.info(String.format("User ID: %s, Role: %s", userId, role));


            // EX )  ROLE_DEVELOPER , ROLE_BOSS
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(role));

            SecurityContext securityContext = SecurityContextHolder.createEmptyContext(); // 빈 context 만들기
            //안에 담을 토큰 만들기
            AbstractAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userId , null , authorities); //비밀번호 null
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            securityContext.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(securityContext);

        }catch (Exception exception){
            exception.printStackTrace();
            logger.error("Authentication error", exception);

        }
        filterChain.doFilter(request,response);

    }
    //request 로 부터 토큰을 꺼내오는 작업이다.
    private String parseBearerToken(HttpServletRequest request){
        String authorization = request.getHeader("Authorization");
        boolean hasAuthorization = StringUtils.hasText(authorization);

        if(!hasAuthorization) return null;

        boolean isBearer = authorization.startsWith("Bearer ");
        if(!isBearer) return null;

        String token = authorization.substring(7);
        return token;
    }

}
