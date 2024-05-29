package com.winti.backend.member.dto.response.auth;

import com.winti.backend.member.common.ResponseCode;
import com.winti.backend.member.common.ResponseMessage;
import com.winti.backend.member.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ModifyUserResponseDto extends ResponseDto {


    private ModifyUserResponseDto(){
        super();
    }
    public static ResponseEntity<ModifyUserResponseDto> success(){
        ModifyUserResponseDto responseBody = new ModifyUserResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> modifyFail(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_ID , ResponseMessage.DUPLICATE_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
