package com.winti.backend.member.dto.response.auth;

import com.winti.backend.member.common.ResponseCode;
import com.winti.backend.member.common.ResponseMessage;
import com.winti.backend.member.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class SignInResponseDto extends ResponseDto {

    private String token;
    private String refreshToken;
    private int expirationTime;

    private SignInResponseDto (String token , String refreshToken){

        super();
        this.token = token;
        this.refreshToken = refreshToken;
        this.expirationTime = 6000000;

    }

    public static ResponseEntity<SignInResponseDto> success (String token ,String refreshToken){
        SignInResponseDto responseBody = new SignInResponseDto(token , refreshToken);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> signInFail(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL , ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

}