package com.shopkart.ecommerce.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String shippingAddress;
    private String phone;
}
