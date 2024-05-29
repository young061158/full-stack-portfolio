package com.winti.backend.member.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SnsModifyUserRequestDto {


    @NotBlank
    private String userId;

    @NotBlank
    private String newId;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String email;

    @NotBlank
    private String gender;
    @NotBlank
    private String useryear;
    @NotBlank
    private String birthday;

    private String address;

    private String subaddress;
}
