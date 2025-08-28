package com.example.backend.Service;

import com.example.backend.Model.Artisan;
import com.example.backend.Model.Product;
import com.example.backend.Model.ProductStatus;
import com.example.backend.Payload.*;
import com.example.backend.Repository.ProductRepository;
import com.example.backend.Security.Util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
@RequiredArgsConstructor
public class ProductServiceImp implements ProductService{

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final AuthUtil authUtil;

    @Value("${project.image}")
    private String imagePath;

    @Value("${project.audio}")
    private String audioPath;

    @Override
    public ProductDraftResponse createProduct( MultipartFile[] images) throws IOException {

        ProductCreatePayload productCreatePayload = null;

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
        Product product = new Product();
        product.setImages(imageUrls);
        product.setArtisan(authUtil.getArtisan());
        productRepository.save(product);

        // ai service will fetch suggestedProductName, suggestedPrice, and suggested Category
        return  modelMapper.map(product, ProductDraftResponse.class);
    }

    @Override
    public ProductDetailResponse generateDescription(MultipartFile audio, String productDetails, Long productId) throws IOException {
        String audioUrl = uploadFile(audioPath,audio);
        Product product = productRepository.findById(productId).orElseThrow();

        // AI service will generate a description and return it

        //java code will be added to give that detail back to the frontend
        return null;
    }

    @Override
    public ProductDTO saveProduct(ProductDTO productDTO, Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("Product not found"));
        product.setProductName(productDTO.getProductName());
        product.setDescription(product.getDescription());
        product.setImages(productDTO.getImages());
        product.setPrice(productDTO.getPrice());
        product.setMaterial(productDTO.getMaterial());
        product.setTags(productDTO.getTags());
        product.setProductStatus(ProductStatus.PUBLISHED);
        productRepository.save(product);

        return modelMapper.map(product,ProductDTO.class);
    }

    @Override
    public Page<ProductDTO> getUserProduct(Pageable pageable) {
        Artisan currentArtisan = authUtil.getArtisan();
        Page<Product> productPage = productRepository.findByArtisan(currentArtisan,pageable);
        return productPage.map(product -> modelMapper.map(product,ProductDTO.class));
    }

    @Override
    public String generateStory(MultipartFile audio, String story, Long productId) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new IllegalArgumentException("Product not found"));
        if (audio!=null){
            String audioUrl = uploadFile(audioPath,audio);

            // AI service will generate a story and return it
            // save in db
            return null;
        }else{
            // AI service will generate a story and return it
            // save in db
            return null;
        }
    }

    @Override
    public TemplateResponse generateTemplate(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new IllegalArgumentException("Product not found"));

        List<String> imageUrls = product.getImages();
        String description = product.getDescription();
        String story = product.getProductStory();

        // AI service we return images and the caption

        return null;
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
