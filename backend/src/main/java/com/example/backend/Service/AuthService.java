package com.example.backend.Service;

import com.example.backend.Payload.ArtisanDTO;

public interface AuthService {
    ArtisanDTO getArtisanDetail(String username, String jwtToken);
}
