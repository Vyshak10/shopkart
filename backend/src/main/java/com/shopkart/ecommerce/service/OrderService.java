package com.shopkart.ecommerce.service;

import com.shopkart.ecommerce.dto.OrderRequest;
import com.shopkart.ecommerce.model.*;
import com.shopkart.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepo;
    private final CartRepository cartRepo;
    private final UserRepository userRepo;

    @Transactional
    public Order placeOrder(String email, OrderRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow();
        List<CartItem> cartItems = cartRepo.findByUser(user);
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        List<OrderItem> items = cartItems.stream().map(c ->
            OrderItem.builder().product(c.getProduct())
                .quantity(c.getQuantity()).price(c.getProduct().getPrice()).build())
            .collect(Collectors.toList());

        BigDecimal total = items.stream()
            .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder().user(user).items(items).totalAmount(total)
            .shippingAddress(req.getShippingAddress()).phone(req.getPhone())
            .status(Order.Status.PENDING).build();
        items.forEach(i -> i.setOrder(order));

        orderRepo.save(order);
        cartRepo.deleteByUser(user);
        return order;
    }

    @Transactional(readOnly = true)
    public List<Order> getMyOrders(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return orderRepo.findByUserWithItems(user);
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepo.findAllWithItems();
    }

    @Transactional
    public Order updateStatus(Long id, String status) {
        Order order = orderRepo.findById(id).orElseThrow();
        order.setStatus(Order.Status.valueOf(status));
        return orderRepo.save(order);
    }
}
