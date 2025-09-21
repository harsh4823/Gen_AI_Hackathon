package com.example.backend.Security.OTP.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JWTResponse {
    private String username;
    private String jwtToken;
}
