package com.winti.backend.config;

import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer {

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            if (!userRepository.existsById("admin")) {
                String adminpassword = passwordEncoder.encode("123456a!");
                UserEntity admin = new UserEntity(adminpassword);
                userRepository.save(admin);
            }
        };
    }
}