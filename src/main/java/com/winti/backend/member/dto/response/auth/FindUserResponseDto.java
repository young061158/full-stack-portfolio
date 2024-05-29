package com.winti.backend.member.dto.response.auth;

import com.winti.backend.member.common.ResponseCode;
import com.winti.backend.member.common.ResponseMessage;
import com.winti.backend.member.dto.request.auth.FindUserRequestDto;
import com.winti.backend.member.dto.response.ResponseDto;
import com.winti.backend.member.entity.UserEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class FindUserResponseDto extends ResponseDto {

    private String id;
    private String username;
    private String password;
    private String email;
    private String gender;
    private String useryear;
    private String birthday;
    private String role;
    private String type;
    private String address;
    private String subaddress;

    private FindUserResponseDto(UserEntity userEntity){
        super();
        this.id = userEntity.getUserId();
        this.username = userEntity.getUsername();
        this.password = userEntity.getPassword();
        this.email = userEntity.getEmail();
        this.gender = userEntity.getGender();
        this.useryear = userEntity.getUserYear();
        this.birthday = userEntity.getBirthday();
        this.role = userEntity.getRole();
        this.type = userEntity.getType();
        this.address = userEntity.getAddress();
        this.subaddress = userEntity.getSubaddress();
    }
    public static ResponseEntity<FindUserResponseDto> success(UserEntity userEntity){
        FindUserResponseDto responseBody = new FindUserResponseDto(userEntity);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> notfindUser(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL , ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }


}
