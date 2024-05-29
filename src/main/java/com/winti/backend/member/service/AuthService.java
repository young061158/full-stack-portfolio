package com.winti.backend.member.service;


import com.winti.backend.member.dto.request.auth.*;
import com.winti.backend.member.dto.response.auth.*;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertificaiton(EmailCertificationRequestDto dto);
    ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);
    ResponseEntity<? super SignUpResponseDto> signUp (SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn (SignInRequestDto dto);
    ResponseEntity<? super FindIdResponseDto> findId (FindIdRequestDto dto);
    ResponseEntity<? super FindPasswordResponseDto> findPw (FindPasswordRequestDto dto);
    ResponseEntity<? super FindUserResponseDto> findUser (FindUserRequestDto dto);
    ResponseEntity<? super ModifyUserResponseDto> modifyUser (ModifyUserRequestDto dto);
    ResponseEntity<? super NewTokenResponseDto> newToken (NewTokenRequestDto dto);
    ResponseEntity<? super DisableUserResponseDto> disableUser (DisableUserRequestDto dto);
    ResponseEntity<? super SnsModifyUserResponseDto> snsModifyUser (SnsModifyUserRequestDto dto);



}
