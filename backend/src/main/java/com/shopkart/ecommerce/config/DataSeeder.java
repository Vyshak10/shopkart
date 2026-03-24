package com.shopkart.ecommerce.config;

import com.shopkart.ecommerce.model.*;
import com.shopkart.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

@Component @RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (productRepo.count() == 0) {
            productRepo.saveAll(List.of(
                Product.builder().name("Apple iPhone 15").description("6.1-inch Super Retina XDR display, A16 Bionic chip, 48MP camera system").price(new BigDecimal("79999")).stock(50).category("Electronics").imageUrl("https://images.unsplash.com/photo-1697469994823-47a0a74a8a20?w=400").rating(4.8).reviewCount(1240).active(true).build(),
                Product.builder().name("Samsung Galaxy S24").description("6.2-inch Dynamic AMOLED, Snapdragon 8 Gen 3, 50MP triple camera").price(new BigDecimal("74999")).stock(40).category("Electronics").imageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400").rating(4.7).reviewCount(980).active(true).build(),
                Product.builder().name("Sony WH-1000XM5").description("Industry-leading noise cancellation, 30-hour battery, Hi-Res Audio").price(new BigDecimal("29990")).stock(80).category("Electronics").imageUrl("https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400").rating(4.9).reviewCount(3200).active(true).build(),
                Product.builder().name("MacBook Air M3").description("13.6-inch Liquid Retina, Apple M3 chip, 18-hour battery, 8GB RAM 256GB SSD").price(new BigDecimal("114900")).stock(25).category("Electronics").imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400").rating(4.9).reviewCount(870).active(true).build(),
                Product.builder().name("Nike Air Max 270").description("Max Air unit in the heel for all-day comfort, breathable mesh upper").price(new BigDecimal("12995")).stock(120).category("Footwear").imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400").rating(4.6).reviewCount(4500).active(true).build(),
                Product.builder().name("Adidas Ultraboost 22").description("Responsive BOOST midsole, Primeknit+ upper, Continental rubber outsole").price(new BigDecimal("14999")).stock(90).category("Footwear").imageUrl("https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400").rating(4.7).reviewCount(2100).active(true).build(),
                Product.builder().name("Levi's 511 Slim Jeans").description("Slim fit through hip and thigh, sits below waist, 99% Cotton").price(new BigDecimal("3499")).stock(200).category("Clothing").imageUrl("https://images.unsplash.com/photo-1542272604-787c3835535d?w=400").rating(4.5).reviewCount(6700).active(true).build(),
                Product.builder().name("Allen Solly Casual Shirt").description("100% pure cotton, slim fit, perfect for office and casual wear").price(new BigDecimal("1799")).stock(150).category("Clothing").imageUrl("https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400").rating(4.3).reviewCount(1800).active(true).build(),
                Product.builder().name("Prestige Induction Cooktop").description("2000W, feather touch panel, 8 preset menus, auto switch-off").price(new BigDecimal("2499")).stock(60).category("Home & Kitchen").imageUrl("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400").rating(4.4).reviewCount(890).active(true).build(),
                Product.builder().name("Philips Air Fryer").description("4.1L capacity, Rapid Air Technology, 80% less fat, dishwasher safe").price(new BigDecimal("8499")).stock(45).category("Home & Kitchen").imageUrl("https://images.unsplash.com/photo-1648146207803-61d6ef98ca3e?w=400").rating(4.6).reviewCount(2300).active(true).build(),
                Product.builder().name("Atomic Habits – James Clear").description("Proven framework for getting 1% better every day, bestseller worldwide").price(new BigDecimal("349")).stock(300).category("Books").imageUrl("https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400").rating(4.9).reviewCount(12000).active(true).build(),
                Product.builder().name("The Alchemist – Paulo Coelho").description("A magical fable about following your dream, 30+ years on bestseller lists").price(new BigDecimal("299")).stock(250).category("Books").imageUrl("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400").rating(4.8).reviewCount(9500).active(true).build()
            ));
        }

        if (userRepo.count() == 0) {
            userRepo.saveAll(List.of(
                User.builder().name("Admin User").email("admin@shopkart.com").password(encoder.encode("admin123")).role(User.Role.ADMIN).build(),
                User.builder().name("Vyshak Kumar").email("vyshak@shopkart.com").password(encoder.encode("user123")).role(User.Role.USER).build()
            ));
        }
    }
}
