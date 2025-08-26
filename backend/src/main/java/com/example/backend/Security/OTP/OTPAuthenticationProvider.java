package com.example.backend.Security.OTP;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OTPAuthenticationProvider implements AuthenticationProvider {

    private final OTPService otpService;
    private final UserDetailsService userDetailsService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String identifier = authentication.getName();
        String otp = authentication.getCredentials().toString();
        String storedOTP = otpService.getOTP(identifier);

        if (storedOTP==null || !storedOTP.equals(otp)){
            throw new BadCredentialsException("Invalid OTP");
        }
        otpService.clearOTP(identifier);
        UserDetails userDetails = userDetailsService.loadUserByUsername(identifier);
        return new OTPAuthenticationToken(userDetails.getAuthorities(),userDetails,null);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OTPAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
