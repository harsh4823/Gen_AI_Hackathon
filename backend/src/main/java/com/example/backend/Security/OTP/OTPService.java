package com.example.backend.Security.OTP;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Random;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class OTPService {
    private static final Integer EXPIRE_MINS=5;
    private LoadingCache<String,String> otpCache;

    public OTPService(){
        otpCache = CacheBuilder.newBuilder()
                .expireAfterWrite(EXPIRE_MINS, TimeUnit.MINUTES)
                .build(new CacheLoader<String, String>() {
                    public String load(String key){
                        return "";
                    }
                });
    }

    public String generateOTP(String key){
        Random random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        String otpString = String.valueOf(otp);
        otpCache.put(key,otpString);
        return otpString;
    }

    public String getOTP(String key){
        try {
            return otpCache.get(key);
        } catch (ExecutionException e) {
            return null;
        }
    }

    public void clearOTP(String key){
        otpCache.invalidate(key);
    }
}
