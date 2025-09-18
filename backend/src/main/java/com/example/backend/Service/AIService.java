package com.example.backend.Service;

import com.example.backend.Payload.AIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AIService {

    private final RestTemplate restTemplate;

    @Value("${python.api.url}")
    private String pythonApiUrl;

    @Autowired
    public AIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AIResponse getResult(MultipartFile image, MultipartFile audio) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        // Create a resource from the image file bytes to send
        // This avoids saving the file to disk just to read it again
        ByteArrayResource imageResource = new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        };

        // Create a resource from the audio file bytes
        ByteArrayResource audioResource = new ByteArrayResource(audio.getBytes()) {
            @Override
            public String getFilename() {
                return audio.getOriginalFilename();
            }
        };

        body.add("image", imageResource);
        body.add("audio", audioResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Make the POST request
        return restTemplate.postForObject(pythonApiUrl, requestEntity, AIResponse.class);
    }
}
