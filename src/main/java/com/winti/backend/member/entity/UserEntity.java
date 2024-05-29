package com.winti.backend.member.entity;

import com.winti.backend.member.dto.request.auth.SignUpRequestDto;
import com.winti.backend.member.dto.request.auth.SnsModifyUserRequestDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "user")
@Table(name ="user")
public class UserEntity {


    @Id
    @Column
    private String userId;
    @Column
    private String username;
    @Column
    private String password;
    @Column
    private String email;
    @Column
    private String type;
    @Column
    private String role;
    @Column
    private String gender;
    @Column
    private String userYear;
    @Column
    private String birthday;
    @Column
    private String address;
    @Column
    private String subaddress;
    @Column
    private boolean disable;

//    String adminpassword = "123456a!";

    public UserEntity (SignUpRequestDto dto){
        this.userId = dto.getId();
        this.username = dto.getUsername();
        this.password = dto.getPassword();
        this.email = dto.getEmail();
        this.type = "app";
        this.role = "ROLE_SNS";
        this.gender = dto.getGender();
        this.userYear = dto.getUseryear();
        this.birthday = dto.getBirthday();
        this.address = dto.getAddress();
        this.subaddress = dto.getSubaddress();
        this.disable = false;
    }

    public UserEntity (SnsModifyUserRequestDto dto){
        this.userId = dto.getNewId();
        this.username = dto.getUsername();
        this.password = dto.getPassword();
        this.email = dto.getEmail();
        this.type = "app";
        this.role = "ROLE_SNS";
        this.gender = dto.getGender();
        this.userYear = dto.getUseryear();
        this.birthday = dto.getBirthday();
        this.address = dto.getAddress();
        this.subaddress = dto.getSubaddress();
        this.disable = false;
    }

    public UserEntity (String password) {
        this.userId = "admin";
        this.username = "WinTi";
        this.password = password;
        this.email = "WinTi";
        this.type = "app";
        this.role = "ROLE_ADMIN";
        this.gender = "";
        this.userYear = "";
        this.birthday = "";
        this.address = "";
        this.subaddress = "";
        this.disable = false;
    }

    public UserEntity (String userId, String username, String email , String type ,
                       String gender, String userYear, String birthday
    ){
        this.userId = userId;
        this.username = username;
        this.password = "KINGDONGKYUN";
        this.email = email;
        this.type = type;
        this.role = "ROLE_SNS";
        this.gender = gender;
        this.userYear = userYear;
        this.birthday = birthday;
        this.disable = false;
    }
    public void changePassword(String newPassword) {
        this.password = newPassword;
    }


    public void modifyUser (String newPassword  , String newAddress, String newSubAdress){
        this.password = newPassword;
        this.address = newAddress;
        this.subaddress = newSubAdress;
    }

    public void disable () {
        this.disable = true;
    }



}
