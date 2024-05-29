package com.winti.backend.member.dto.response.auth;


import com.winti.backend.member.common.ResponseCode;
import com.winti.backend.member.common.ResponseMessage;
import com.winti.backend.member.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class FindPasswordResponseDto extends ResponseDto{

    private FindPasswordResponseDto(){
        super();
    }
    public static ResponseEntity<FindPasswordResponseDto> success(){
        FindPasswordResponseDto responseBody = new FindPasswordResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicateId(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_ID , ResponseMessage.DUPLICATE_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

}
