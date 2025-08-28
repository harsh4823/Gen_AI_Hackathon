package com.example.backend.Controller;

import com.example.backend.Model.Artisan;
import com.example.backend.Payload.UserInfoResponse;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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
            ResponseCookie cookie = jwtUtils.generateJwtCookie(userDetails);
            String tempToken = cookie.getValue();
            Map<String,String> response = Map.of(
                "message","OTP Verified Successfully. Please update your username",
                 "temporaryToken",tempToken);
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,cookie.toString()).
                    body(response);
        }
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
        String jwtToken = jwtCookie.getValue();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,jwtCookie.toString()).
                body(new JWTResponse(userDetails.getUsername(),jwtToken));
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
        ResponseCookie finalCookie = jwtUtils.generateJwtCookie(updatedUserDetails);
        String finalJWT = finalCookie.getValue();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,finalCookie.toString()).
                body(new JWTResponse(updatedUserDetails.getUsername(),finalJWT));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(){
        ResponseCookie cookie = jwtUtils.cleanCookie();
        return ResponseEntity.ok().header(
                HttpHeaders.SET_COOKIE,cookie.toString())
                .body(Map.of("message","Logged out Successfully"));
    }

    @GetMapping("/profile/info")
    public ResponseEntity<?> getUserInfo(Authentication authentication){
        UserDetailsImp userDetails = (UserDetailsImp) authentication.getPrincipal();
        Artisan artisan = userDetails.getArtisan();
        UserInfoResponse response = new UserInfoResponse(artisan.getUserName(),artisan.getEmail(),artisan.getPhoneNo());
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody UserInfoResponse request,Authentication authentication){
        UserInfoResponse userInfoResponse = userDetailServiceImp.updateProfile(request,authentication);
        return ResponseEntity.ok().body(userInfoResponse);
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(Authentication authentication){
        UserDetailsImp userDetails = (UserDetailsImp) authentication.getPrincipal();
        UserInfoResponse response = userDetailServiceImp.deleteArtisan(userDetails);
        return ResponseEntity.ok().body(response);
    }
}
