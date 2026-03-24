package com.shopkart.ecommerce.service;

import com.shopkart.ecommerce.dto.CartItemResponse;
import com.shopkart.ecommerce.model.*;
import com.shopkart.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    private User getUser(String email) {
        return userRepo.findByEmail(email).orElseThrow();
    }

    public List<CartItemResponse> getCart(String email) {
        return cartRepo.findByUser(getUser(email)).stream().map(i ->
            new CartItemResponse(i.getId(), i.getProduct().getId(),
                i.getProduct().getName(), i.getProduct().getImageUrl(),
                i.getProduct().getPrice(), i.getQuantity()))
            .collect(Collectors.toList());
    }

    public void addToCart(String email, Long productId, int quantity) {
        User user = getUser(email);
        Product product = productRepo.findById(productId).orElseThrow();
        cartRepo.findByUserAndProduct(user, product).ifPresentOrElse(
            i -> { i.setQuantity(i.getQuantity() + quantity); cartRepo.save(i); },
            () -> cartRepo.save(CartItem.builder()
                    .user(user).product(product).quantity(quantity).build()));
    }

    public void updateItem(String email, Long itemId, int quantity) {
        CartItem item = cartRepo.findById(itemId).orElseThrow();
        if (quantity <= 0) cartRepo.delete(item);
        else { item.setQuantity(quantity); cartRepo.save(item); }
    }

    public void removeItem(String email, Long itemId) {
        cartRepo.deleteById(itemId);
    }

    public void clearCart(String email) {
        cartRepo.deleteByUser(getUser(email));
    }
}
