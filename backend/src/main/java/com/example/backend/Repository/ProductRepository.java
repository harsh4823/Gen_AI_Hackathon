package com.example.backend.Repository;

import com.example.backend.Model.Artisan;
import com.example.backend.Model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    Page<Product> findByArtisan(Artisan currentArtisan, Pageable pageable);
}
