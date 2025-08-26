package com.example.backend.Security.OTP.DTO;

import lombok.Data;

@Data
public class OTPLoginRequest {
    private String identifier;
    private String otp;
}
