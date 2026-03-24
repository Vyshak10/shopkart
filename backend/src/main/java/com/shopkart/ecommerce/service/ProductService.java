package com.shopkart.ecommerce.service;

import com.shopkart.ecommerce.model.Product;
import com.shopkart.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepo;

    public List<Product> getAll(String category, String search) {
        return productRepo.findFiltered(
            (category == null || category.isEmpty()) ? null : category,
            (search == null || search.isEmpty()) ? null : search);
    }

    public Product getById(Long id) {
        return productRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<String> getCategories() { return productRepo.findAllCategories(); }

    public Product create(Product product) { return productRepo.save(product); }

    public Product update(Long id, Product updated) {
        Product p = getById(id);
        p.setName(updated.getName()); p.setDescription(updated.getDescription());
        p.setPrice(updated.getPrice()); p.setStock(updated.getStock());
        p.setCategory(updated.getCategory()); p.setImageUrl(updated.getImageUrl());
        return productRepo.save(p);
    }

    public void delete(Long id) {
        Product p = getById(id);
        p.setActive(false);
        productRepo.save(p);
    }
}
