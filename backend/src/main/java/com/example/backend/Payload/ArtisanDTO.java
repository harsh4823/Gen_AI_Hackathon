package com.example.backend.Payload;

import lombok.Data;

@Data
public class ArtisanDTO {
    private Long artisanId;
    private String userName;
    private String email;
    private String phoneNo;
    private String jwtToken;
}
