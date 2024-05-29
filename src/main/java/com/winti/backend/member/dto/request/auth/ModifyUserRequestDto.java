package com.winti.backend.member.dto.request.auth;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ModifyUserRequestDto {

    private String id;

    private String password;

    private String address;

    private String subaddress;

}
