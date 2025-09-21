package com.example.backend.Payload;

import com.example.backend.Model.ProductStatus;
import lombok.Data;

import java.util.List;

@Data
public class ProductDTO {

    private Long productId;
    private String productName;
    private String description;
    private List<String> images;
    private List<String> material;

    // The JSON key is "keyFeatures", which matches this field name. Remove the annotation.
    private List<String> keyFeatures;

    // The JSON key is "careInstructions", which matches this field name. Remove the annotation.
    private String careInstructions;

    private ProductStatus status;
}