package com.winti.backend.member.dto.response.auth;

import com.winti.backend.member.common.ResponseCode;
import com.winti.backend.member.common.ResponseMessage;
import com.winti.backend.member.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class NewTokenResponseDto extends ResponseDto {

    private String token;
    private String refreshToken;
    private int expirationTime;

    private NewTokenResponseDto (String token , String refreshToken){

        super();
        this.token = token;
        this.refreshToken = refreshToken;
        this.expirationTime = 3600;
    }

    public static ResponseEntity<NewTokenResponseDto> success (String token , String refreshToken){
        NewTokenResponseDto responseBody = new NewTokenResponseDto(token , refreshToken);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> signInFail(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL , ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

}