package com.example.backend.Repository;

import com.example.backend.Model.Artisan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtisanRepository extends JpaRepository<Artisan,Long> {
    Optional<Artisan> findByEmail(String email);
    Optional<Artisan> findByPhoneNo(String phoneNo);
    Optional<Artisan> findByUserName(String username);

}
