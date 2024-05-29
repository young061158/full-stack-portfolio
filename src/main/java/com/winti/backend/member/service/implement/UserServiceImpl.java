package com.winti.backend.member.service.implement;

import com.winti.backend.member.Exception.DataNotFoundException;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.repository.UserRepository;
import com.winti.backend.member.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserEntity getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public UserEntity getUser(String username) {
        Optional<UserEntity> siteUser = this.userRepository.findByUsername(username);
        if (siteUser.isPresent()) {
            return siteUser.get();
        } else {
            throw new DataNotFoundException("siteuser not found");
        }
    }
}
