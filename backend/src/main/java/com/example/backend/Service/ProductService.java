package com.example.backend.Service;

import com.example.backend.Payload.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProductService {
    AIResponse createProduct(MultipartFile[] productDraftResponse, MultipartFile audio) throws IOException;

    ProductDetailResponse generateDescription(MultipartFile audio, String productDetails, Long productId) throws IOException;

    ProductDTO saveProduct(ProductDTO productDTO, Long id);

    Page<ProductDTO> getUserProduct(Pageable pageable);

    String generateStory(MultipartFile audio, String story, Long productId) throws IOException;

    TemplateResponse generateTemplate(Long productId);
}
