package com.example.backend.Controller;

import com.example.backend.Payload.ProductDraftResponse;
import com.example.backend.Service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDraftResponse> createProduct(
            @RequestPart(value = "payload",required = false) String payloadJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) throws IOException {
        ProductDraftResponse res = productService.createProduct(payloadJson,images);
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

}
