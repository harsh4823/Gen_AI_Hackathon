package com.example.backend.Payload;

import lombok.Data;

import java.util.List;

@Data
public class ProductResponse {
    private List<ProductDTO> content;

    private Integer pageNumber;
    private Integer pageSize;
    private long totalItems;
    private Integer totalPages;
    private boolean lastPage;
}
