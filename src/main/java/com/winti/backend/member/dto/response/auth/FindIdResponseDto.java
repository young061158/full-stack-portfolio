package com.winti.backend.member.dto.response.auth;


import com.winti.backend.member.common.ResponseCode;
import com.winti.backend.member.common.ResponseMessage;
import com.winti.backend.member.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
public class FindIdResponseDto extends ResponseDto {

    private List<String> userIds;

    private FindIdResponseDto (List<String> userIds){
        super();
        this.userIds = userIds;
    }

    public static ResponseEntity<FindIdResponseDto> success(List<String> userIds){
        FindIdResponseDto responseBody = new FindIdResponseDto(userIds);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> notfindId(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL , ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

}
