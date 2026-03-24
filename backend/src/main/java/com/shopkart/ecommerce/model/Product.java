package com.shopkart.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "products")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String name;
    @Column(length = 1000) private String description;
    @Column(nullable = false) private BigDecimal price;
    @Column(nullable = false) private Integer stock;
    private String category;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;

    @Column(nullable = false)
    private Boolean active = true;
}
