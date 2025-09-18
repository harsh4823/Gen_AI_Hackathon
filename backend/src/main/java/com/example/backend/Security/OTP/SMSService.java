package com.example.backend.Security.OTP;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SMSService {

    @Value( "${twilio.account.sid}")
    private String twilioAccountSid;
    @Value( "${twilio.auth.token}")
    private String twilioAuthToken;

    @PostConstruct
    public void init(){
        Twilio.init(twilioAccountSid, twilioAuthToken);
    }

    public void sendSMS(String phoneNumber,String otp){
        try {
        Message message = Message.creator(new PhoneNumber("+91"+phoneNumber),
                        new PhoneNumber("+12186307315"),
                        "Your OTP is "+otp)
                .create();

        System.out.println(message.getBody());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
