package com.example.backend.Security.Services;

import com.example.backend.Model.Artisan;
import com.example.backend.Repository.ArtisanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImp implements UserDetailsService {

    private final ArtisanRepository artisanRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Artisan artisan = artisanRepository.findByEmail(identifier)
                .orElseGet(()->artisanRepository.findByPhoneNo(identifier).
                        orElseGet(()->createNewArtisan(identifier)));
        return UserDetailsImp.build(artisan,identifier);
    }

    private Artisan createNewArtisan(String identifier) {
        System.out.println("Artisan not found. Creating new artisan with identifier : "+identifier);
        Artisan artisan = new Artisan();
        if (isEmail(identifier)){
            artisan.setEmail(identifier);
        }else {
            artisan.setPhoneNo(identifier);
        }
        return artisanRepository.save(artisan);
    }

    public boolean isEmail(String identifier) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(identifier).matches();
    }
}
