package com.example.backend.Service;

import com.example.backend.Payload.ProductDraftResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProductService {
    ProductDraftResponse createProduct(String payloadJson, MultipartFile[] productDraftResponse) throws IOException;
}
