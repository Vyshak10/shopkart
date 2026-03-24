package com.shopkart.ecommerce.controller;

import com.shopkart.ecommerce.dto.OrderRequest;
import com.shopkart.ecommerce.model.Order;
import com.shopkart.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/orders")
@RequiredArgsConstructor @Tag(name = "Orders")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new order")
    public ResponseEntity<Order> place(@AuthenticationPrincipal UserDetails ud,
                                       @RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderService.placeOrder(ud.getUsername(), req));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my orders")
    public List<Order> myOrders(@AuthenticationPrincipal UserDetails ud) {
        return orderService.getMyOrders(ud.getUsername());
    }

    @GetMapping
    @Operation(summary = "Get all orders (Admin)")
    public List<Order> allOrders() { return orderService.getAllOrders(); }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status (Admin)")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                              @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("status")));
    }
}
