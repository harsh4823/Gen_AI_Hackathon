package com.example.backend.Service;

import com.example.backend.Payload.ProductDTO;
import com.example.backend.Payload.ProductDetailResponse;
import com.example.backend.Payload.ProductDraftResponse;
import com.example.backend.Payload.TemplateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProductService {
    ProductDraftResponse createProduct(MultipartFile[] productDraftResponse) throws IOException;

    ProductDetailResponse generateDescription(MultipartFile audio, String productDetails, Long productId) throws IOException;

    ProductDTO saveProduct(ProductDTO productDTO, Long id);

    Page<ProductDTO> getUserProduct(Pageable pageable);

    String generateStory(MultipartFile audio, String story, Long productId) throws IOException;

    TemplateResponse generateTemplate(Long productId);
}
