package com.example.backend.Service;

import com.example.backend.Model.Artisan;
import com.example.backend.Payload.ArtisanDTO;
import com.example.backend.Repository.ArtisanRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService{

    private final ArtisanRepository artisanRepository;
    private final ModelMapper modelMapper;

    @Override
    public ArtisanDTO getArtisanDetail(String username, String jwtToken) {
        Artisan artisan = artisanRepository.findByPhoneNo(username)
                .orElse(artisanRepository.findByEmail(username)
                        .orElseThrow(()->new UsernameNotFoundException("User not found")));
        ArtisanDTO artisanDTO = modelMapper.map(artisan, ArtisanDTO.class);
        artisanDTO.setJwtToken(jwtToken);
        return artisanDTO;
    }
}
