package com.example.backend.Security.JWT;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JWTUtils {

    @Value("${spring.app.jwtSecret}")
    private String secret;

    @Value("${spring.app.jwtExpirationMs}")
    private int expirationMs;

    @Value("${spring.app.jwtCookieName}")
    private String jwtCookie;

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, jwtCookie);
        if (cookie != null) {
            System.out.println("COOKIE: " + cookie.getValue());
            return cookie.getValue();
        } else {
            return null;
        }
    }

    public String getJwtFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken!=null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }

    public ResponseCookie generateJwtCookie(UserDetails userPrincipal) {
        String jwt = generateTokenFromUsername(userPrincipal);
        return ResponseCookie.from(jwtCookie, jwt).path("/api").maxAge(24 * 60 * 60)
                .httpOnly(false)
                .secure(false)
                .build();
    }

    public ResponseCookie cleanCookie(){
        return ResponseCookie.from(jwtCookie,null).path("/api").build();
    }

    public String generateTokenFromUsername(UserDetails userDetails){
        String username = userDetails.getUsername();
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + expirationMs))
                .signWith(getKey())
                .compact();
    }

    public String getUserNameFromJwtToken(String token){
        return Jwts.parser()
                .verifyWith((SecretKey)getKey())
                .build().parseSignedClaims(token)
                .getPayload().getSubject();
    }

    boolean validateJwtToken(String token){
        try {
            System.out.println("Validate");
            Jwts.parser().verifyWith((SecretKey)getKey()).build().parseSignedClaims(token);
            return true;
        }catch (MalformedJwtException e){
            System.err.println("Invalid JWT token");
        }catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired");
        }catch (UnsupportedJwtException e){
            System.err.println("JWT token is unsupported");
        }catch (IllegalArgumentException e){
            System.err.println("JWT claims string is empty");
        }
        return false;
    }

    private Key getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}
