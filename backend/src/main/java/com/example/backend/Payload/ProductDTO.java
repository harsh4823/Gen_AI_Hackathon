package com.example.backend.Payload;

import com.example.backend.Model.ProductStatus;
import lombok.Data;

import java.util.List;

@Data
public class ProductDTO {
    private String productId;
    private String productName;
    private String description;
    private List<String> images;
    private Double price;
    private String currency;
    private String material;
    private List<String> tags;
    private ProductStatus status;
}
