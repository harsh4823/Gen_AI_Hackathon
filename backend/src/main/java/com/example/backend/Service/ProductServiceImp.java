package com.example.backend.Service;

import com.example.backend.Model.Product;
import com.example.backend.Model.ProductStatus;
import com.example.backend.Payload.ProductCreatePayload;
import com.example.backend.Payload.ProductDraftResponse;
import com.example.backend.Repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImp implements ProductService{

    private final String imagePath;
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    public ProductServiceImp(
            @Value("${project.image}") String imagePath,
            ProductRepository productRepository,
            ObjectMapper objectMapper,
            ModelMapper modelMapper) {
        this.imagePath = imagePath;
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
        this.modelMapper = modelMapper;
    }

    @Override
    public ProductDraftResponse createProduct(String payloadJson, MultipartFile[] images) throws IOException {

        ProductCreatePayload productCreatePayload = null;
        if (payloadJson!=null && !payloadJson.isBlank()){
            productCreatePayload = objectMapper.readValue(payloadJson, ProductCreatePayload.class);
        }
        List<String> imageUrls = images == null ? List.of():
                Arrays.stream(images)
                        .map(img-> {
                            try {
                                return uploadFile(imagePath,img);
                            } catch (IOException e) {
                                throw new RuntimeException("Image Upload Failed : " + img.getOriginalFilename());
                            }
                        })
                        .toList();
        Product product = getProduct(imageUrls,productCreatePayload);
        productRepository.save(product);

        // ai service will fetch suggestedProductName , suggestedPrice , and suggested Category
        return  modelMapper.map(product, ProductDraftResponse.class);
    }

    private Product getProduct(List<String> imageUrls,ProductCreatePayload productCreatePayload){
        Product product = new Product();
        product.setImages(imageUrls);

        if (productCreatePayload!=null){
            modelMapper.map(productCreatePayload,Product.class);
        }
        product.setProductStatus(ProductStatus.DRAFT);

        return product;
    }

    private String uploadFile(String path, MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();

        if (originalFileName==null){
            throw new IOException("File must have a valid name");
        }
        String randomId = UUID.randomUUID().toString();
        String fileName = randomId.concat(originalFileName.substring(originalFileName.lastIndexOf('.')));

        File folder = new File(imagePath);

        if(!folder.exists()){
            folder.mkdirs();
        }

        Path filePath = Path.of(imagePath, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }
}
