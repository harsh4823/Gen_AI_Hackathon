package com.example.backend.Payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCreatePayload {
    public String productName;
    private String category;
    private Double price;
    private String currency;
    private Boolean draft;
}
