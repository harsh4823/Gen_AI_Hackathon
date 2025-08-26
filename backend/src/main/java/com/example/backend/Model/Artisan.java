package com.example.backend.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Artisan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long artisanId;
    private String userName;
    @Email
    private String email;
    @Size(max = 13)
    private String phoneNo;

    @OneToMany(mappedBy = "artisan",cascade = {CascadeType.MERGE,CascadeType.PERSIST},
            orphanRemoval = true)
    @ToString.Exclude
    private Set<Product> products = new HashSet<>();
}
