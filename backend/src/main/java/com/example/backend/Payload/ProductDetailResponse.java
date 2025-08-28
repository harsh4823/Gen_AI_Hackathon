package com.example.backend.Payload;

import lombok.Data;

import java.util.List;

@Data
public class ProductDetailResponse {
    private String productId;
    private String suggestedDescription;
    private Double suggestedPrice;
    private String suggestedMaterial;
    private List<String> suggestedTags;
}
