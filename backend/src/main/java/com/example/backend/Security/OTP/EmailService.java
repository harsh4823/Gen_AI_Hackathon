package com.example.backend.Security.OTP;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridKey;

    public void sendEmail(String toEmail,String otp){
        Email from = new Email("harsh924823@gmail.com","Hackathon");
        String subject = "OTP for Gen AI Hackathon";
        Email to = new Email(toEmail);
        Content content = new Content("text/plain","Your OTP is "+otp);
        Mail mail = new Mail(from,subject,to,content);
        SendGrid sg = new SendGrid(sendGridKey);
        Request request = new Request();
        try{
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
