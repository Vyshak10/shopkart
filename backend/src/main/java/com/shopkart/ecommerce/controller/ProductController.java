package com.shopkart.ecommerce.controller;

import com.shopkart.ecommerce.model.Product;
import com.shopkart.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/products")
@RequiredArgsConstructor @Tag(name = "Products")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products with optional filters")
    public List<Product> getAll(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String search) {
        return productService.getAll(category, search);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all categories")
    public List<String> getCategories() {
        return productService.getCategories();
    }

    @PostMapping
    @Operation(summary = "Create product (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Product> create(@RequestBody Product product) {
        return ResponseEntity.ok(productService.create(product));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.update(id, product));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
