package com.example.backend.Security.Services;

import com.example.backend.Model.Artisan;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class UserDetailsImp implements UserDetails {
    @Serial
    private static final long serialVersionUID = 1L;
    @Getter
    private final Artisan artisan;
    private final String username;
    private final Collection<? extends GrantedAuthority> authorities;

    public static UserDetails build(Artisan artisan, String identifier) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
         return new UserDetailsImp(artisan,identifier,authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return this.username;
    }
}
