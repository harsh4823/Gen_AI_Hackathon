package com.example.backend.Controller;

import com.example.backend.Model.Artisan;
import com.example.backend.Repository.ArtisanRepository;
import com.example.backend.Security.JWT.JWTUtils;
import com.example.backend.Security.OTP.DTO.JWTResponse;
import com.example.backend.Security.OTP.DTO.OTPLoginRequest;
import com.example.backend.Security.OTP.DTO.OTPRequest;
import com.example.backend.Security.OTP.DTO.UserNameRequest;
import com.example.backend.Security.OTP.EmailService;
import com.example.backend.Security.OTP.OTPAuthenticationToken;
import com.example.backend.Security.OTP.OTPService;
import com.example.backend.Security.OTP.SMSService;
import com.example.backend.Security.Services.UserDetailServiceImp;
import com.example.backend.Security.Services.UserDetailsImp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final OTPService otpService;
    private final AuthenticationManager authenticationManager;
    private final JWTUtils jwtUtils;
    private final ArtisanRepository artisanRepository;
    private final EmailService emailService;
    private final SMSService smsService;
    private final UserDetailServiceImp userDetailServiceImp;

    @PostMapping("/otp/generate")
    public ResponseEntity<String> generateOTP(@RequestBody OTPRequest otpRequest){
        String otp = otpService.generateOTP(otpRequest.getIdentifier());
        if (userDetailServiceImp.isEmail(otpRequest.getIdentifier())){
        emailService.sendEmail(otpRequest.getIdentifier(),otp);
        }else{
            smsService.sendSMS(otpRequest.getIdentifier(),otp);
            System.out.println(otp);
        }
        return ResponseEntity.ok("OTP Generated Successfully");
    }

    @PostMapping("/otp/login")
    public ResponseEntity<?> loginWithOTP(@RequestBody OTPLoginRequest otpLoginRequest){
        Authentication unauthenticated = new OTPAuthenticationToken(otpLoginRequest.getIdentifier(),otpLoginRequest.getOtp());
        Authentication authenticated = authenticationManager.authenticate(unauthenticated);
        SecurityContextHolder.getContext().setAuthentication(authenticated);

        UserDetailsImp userDetails = (UserDetailsImp) authenticated.getPrincipal();
        Artisan artisan = userDetails.getArtisan();
        if (artisan.getUserName()==null){
            String tempToken = jwtUtils.generateTokenFromUsername(userDetails);
            Map<String,String> response = Map.of(
                "message","OTP Verified Successfully. Please update your username",
                 "temporaryToken",tempToken);
            return new ResponseEntity<>(response,HttpStatus.CREATED);
        }
        String jwt = jwtUtils.generateTokenFromUsername(userDetails);
        return new ResponseEntity<>(new JWTResponse(userDetails.getUsername(),jwt), HttpStatus.OK);
    }

    @PutMapping("/profile/username")
    public ResponseEntity<?> setUserName(@RequestBody UserNameRequest userNameRequest,Authentication authentication){
        UserDetailsImp userDetails = (UserDetailsImp) authentication.getPrincipal();
        Artisan artisan = userDetails.getArtisan();

        if (artisan.getUserName()!=null){
            return ResponseEntity.badRequest().body(Map.of("error","Username already set"));
        }
        artisan.setUserName(userNameRequest.getUsername());
        artisanRepository.save(artisan);
        UserDetails updatedUserDetails = UserDetailsImp.build(artisan,userDetails.getUsername());
        String finalJWT = jwtUtils.generateTokenFromUsername(updatedUserDetails);
        return ResponseEntity.ok(new JWTResponse(updatedUserDetails.getUsername(),finalJWT));
    }
}
