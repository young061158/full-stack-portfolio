package com.winti.backend.member.service;

import com.winti.backend.member.entity.UserEntity;

public interface UserService {
    UserEntity getUserById(String id);

    UserEntity getUser(String username);

}