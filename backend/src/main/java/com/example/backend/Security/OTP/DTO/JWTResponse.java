package com.example.backend.Security.OTP.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JWTResponse {
    private String identifier;
    private String jwtToken;
}
