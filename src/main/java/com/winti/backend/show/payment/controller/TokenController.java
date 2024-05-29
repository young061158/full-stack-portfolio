package com.winti.backend.show.payment.controller;


import com.winti.backend.show.payment.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class TokenController {

    private final RestTemplate restTemplate;



    private final TokenService tokenService;
    @GetMapping("/get-token")
    public ResponseEntity<String> getToken() {
        try {
            String token = tokenService.fetchToken();
            return ResponseEntity.ok(token);

        } catch (IOException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Failed to fetch token: " + e.getMessage());
        }
    }



}
