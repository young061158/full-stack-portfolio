package com.winti.backend.member.controller;

import com.winti.backend.member.dto.request.auth.*;
import com.winti.backend.member.dto.response.auth.*;
import com.winti.backend.member.provider.JwtProvider;
import com.winti.backend.member.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AuthController {

    private final JwtProvider jwtProvider;
    private final AuthService authService;

    @PostMapping("/id-check")
    public ResponseEntity<? super IdCheckResponseDto> idCheck(
            @RequestBody @Valid IdCheckRequestDto requestBody) {
        ResponseEntity<? super IdCheckResponseDto> response = authService.idCheck(requestBody);
        return response;
    }

    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(
            @RequestBody @Valid EmailCertificationRequestDto requestBody
            ) {
        ResponseEntity<? super EmailCertificationResponseDto> response = authService.emailCertificaiton(requestBody);
        return response;
    }

    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification (
            @RequestBody @Valid CheckCertificationRequestDto requestBody
            ){
        ResponseEntity<? super CheckCertificationResponseDto> response = authService.checkCertification(requestBody);
        return response;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signUp(
            @RequestBody SignUpRequestDto requestBody
            ){
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
        return response;
    }

    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn (
            @RequestBody @Valid SignInRequestDto requestBody
            ){
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);

        return response;
    }

    @PostMapping("/find-id")
    public ResponseEntity<? super FindIdResponseDto> findId(
        @RequestBody @Valid FindIdRequestDto  requestBody){
        ResponseEntity<? super FindIdResponseDto> response = authService.findId(requestBody);
        return response;
    }

    @PostMapping("/find-pw")
    public ResponseEntity<? super FindPasswordResponseDto> findPw(
            @RequestBody @Valid FindPasswordRequestDto  requestBody){
        ResponseEntity<? super FindPasswordResponseDto> response = authService.findPw(requestBody);
        return response;
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        // 현재 사용자의 토큰을 가져와서 만료시킵니다.
        String token = jwtProvider.resolveTokenFromRequest(request);
        jwtProvider.invalidateToken(token);

        // 현재 세션을 만료시킵니다.
        SecurityContextHolder.clearContext();

        // 로그아웃 성공을 클라이언트에게 응답합니다.
        return ResponseEntity.ok("로그아웃이 성공적으로 처리되었습니다.");
    }

    @DeleteMapping("/{token}")
    public void deleteToken(@PathVariable("token") String token) {

        jwtProvider.addToBlacklist(token); // 토큰을 블랙리스트에 추가하여 삭제
    }

    @PostMapping("/find-user")
    public ResponseEntity<? super FindUserResponseDto> finduser(
            @RequestBody @Valid FindUserRequestDto  requestBody){
        ResponseEntity<? super FindUserResponseDto> response = authService.findUser(requestBody);
        return response;
    }

    @PostMapping("/modify-user")
    public ResponseEntity<? super ModifyUserResponseDto> modifyUser(
            @RequestBody @Valid ModifyUserRequestDto  requestBody){
        ResponseEntity<? super ModifyUserResponseDto> response = authService.modifyUser(requestBody);
        return response;
    }

    @PostMapping("/new-token")
    public ResponseEntity<? super NewTokenResponseDto> newToken (
            @RequestBody @Valid NewTokenRequestDto requestBody
    ){
        ResponseEntity<? super NewTokenResponseDto> response = authService.newToken(requestBody);
        return response;
    }

    @PostMapping("/disable-user")
    public ResponseEntity<? super DisableUserResponseDto> newToken (
            @RequestBody @Valid DisableUserRequestDto requestBody
    ){
        ResponseEntity<? super DisableUserResponseDto> response = authService.disableUser(requestBody);
        return response;
    }

    @PostMapping("/snsmodify-user")
    public ResponseEntity<? super SnsModifyUserResponseDto> newToken (
            @RequestBody @Valid SnsModifyUserRequestDto requestBody
    ){
        ResponseEntity<? super SnsModifyUserResponseDto> response = authService.snsModifyUser(requestBody);
        return response;
    }
}



