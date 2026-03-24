package com.shopkart.ecommerce.controller;

import com.shopkart.ecommerce.dto.CartItemResponse;
import com.shopkart.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/cart")
@RequiredArgsConstructor @Tag(name = "Cart")
@SecurityRequirement(name = "bearerAuth")
public class CartController {
    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get user cart")
    public List<CartItemResponse> getCart(@AuthenticationPrincipal UserDetails ud) {
        return cartService.getCart(ud.getUsername());
    }

    @PostMapping("/add")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<String> add(@AuthenticationPrincipal UserDetails ud,
                                      @RequestBody Map<String, Object> body) {
        cartService.addToCart(ud.getUsername(),
            Long.parseLong(body.get("productId").toString()),
            Integer.parseInt(body.get("quantity").toString()));
        return ResponseEntity.ok("Added to cart");
    }

    @PutMapping("/{itemId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<String> update(@AuthenticationPrincipal UserDetails ud,
                                         @PathVariable Long itemId,
                                         @RequestBody Map<String, Object> body) {
        cartService.updateItem(ud.getUsername(), itemId,
            Integer.parseInt(body.get("quantity").toString()));
        return ResponseEntity.ok("Updated");
    }

    @DeleteMapping("/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<Void> remove(@AuthenticationPrincipal UserDetails ud,
                                       @PathVariable Long itemId) {
        cartService.removeItem(ud.getUsername(), itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear entire cart")
    public ResponseEntity<Void> clear(@AuthenticationPrincipal UserDetails ud) {
        cartService.clearCart(ud.getUsername());
        return ResponseEntity.noContent().build();
    }
}
