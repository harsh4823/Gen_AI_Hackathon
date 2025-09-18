package com.example.backend.Controller;

import com.example.backend.Payload.*;
import com.example.backend.Service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<?> createProduct(
            @RequestPart(value = "images") MultipartFile[] images,
            @RequestPart(value = "audio") MultipartFile audio
    ) throws IOException {
       AIResponse res = productService.createProduct(images,audio);
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping(value = "/description/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> generateDescription(
            @PathVariable(value = "productId") Long productId,
            @RequestPart(value = "audio",required = false) MultipartFile audio,
            @RequestPart(value = "productDetails",required = false) String productDetails
    ) throws IOException {
        ProductDetailResponse productDetailResponse = productService.generateDescription(audio,productDetails,productId);
        return new ResponseEntity<>(productDetailResponse,HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> saveProduct(@RequestBody ProductDTO productDTO,@PathVariable Long id){
        ProductDTO savedProductDTO = productService.saveProduct(productDTO,id);
        return new ResponseEntity<>(savedProductDTO,HttpStatus.OK);
    }

    @GetMapping("/artisan")
    public ResponseEntity<Page<ProductDTO>> getArtisanProducts(Pageable pageable){
        Page<ProductDTO> productDTOPage = productService.getUserProduct(pageable);
        return new ResponseEntity<>(productDTOPage,HttpStatus.OK);
    }

    @PostMapping(value = "/story/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> generateStory(MultipartFile audio,String story,@PathVariable Long productId )
            throws IOException {
        String response = productService.generateStory(audio,story,productId);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/template/{productId}")
    public ResponseEntity<?> generateTemplate(@PathVariable Long productId){
        TemplateResponse templateResponse = productService.generateTemplate(productId);
        return new ResponseEntity<>(templateResponse,HttpStatus.OK);
    }
}
