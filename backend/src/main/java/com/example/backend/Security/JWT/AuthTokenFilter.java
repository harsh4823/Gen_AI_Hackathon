package com.example.backend.Security.JWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            String token = parseJwt(request);
            String username = null;
            if (token != null && jwtUtils.validateJwtToken(token)){
                 username = jwtUtils.getUserNameFromJwtToken(token);

                System.out.println("Username: " + username);

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            System.out.println("User: " + userDetails.getUsername() + " | Authorities: " + userDetails.getAuthorities());

            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                    new UsernamePasswordAuthenticationToken(userDetails,
                            null,userDetails.getAuthorities());

            usernamePasswordAuthenticationToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        } catch (Exception e) {
            System.err.println("Cannot set user authentication: " + e.getMessage());
        }
        filterChain.doFilter(request,response);
    }

    private String parseJwt(HttpServletRequest request) {
        String jwtFromCookie = jwtUtils.getJwtFromCookies(request);
        if(jwtFromCookie!=null){
            return jwtFromCookie;
        }
        String jwtFromHeader = jwtUtils.getJwtFromHeader(request);
        if (jwtFromHeader!=null){
            return jwtFromHeader;
        }
        return null;
    }

}
