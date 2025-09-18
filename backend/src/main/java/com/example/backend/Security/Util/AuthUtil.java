package com.example.backend.Security.Util;

import com.example.backend.Model.Artisan;
import com.example.backend.Repository.ArtisanRepository;
import com.example.backend.Security.Services.UserDetailServiceImp;
import com.example.backend.Security.Services.UserDetailsImp;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUtil {

    private final ArtisanRepository artisanRepository;
    private final UserDetailServiceImp userDetailServiceImp;

    private Authentication getAuthentication(){
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getIdentifier(){
        return getAuthentication().getName();
    }

    public Artisan getArtisan(){
        Object principal = getAuthentication().getPrincipal();

        if (principal instanceof UserDetailsImp){
            return ((UserDetailsImp) principal).artisan();
        }
        throw new IllegalStateException("Invalid principal");
    }

}
