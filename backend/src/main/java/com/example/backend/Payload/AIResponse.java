package com.example.backend.Payload;

import lombok.Data;

import java.util.List;

@Data
public class AIResponse {
    private Long productId;
    private String title;
    private String description;
    private List<String> keyFeatures;
    private List<String> materials;
    private List<String> images;
    private String careInstructions;
}
