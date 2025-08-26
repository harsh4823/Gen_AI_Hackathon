package com.example.backend.Payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDraftResponse {
    private Long productId;
    private String status;
    private List<String> images;
    private String suggestedProductName;
    private String suggestedCategory;
    private String suggestedPrice;
}
