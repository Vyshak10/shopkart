package com.shopkart.ecommerce.service;

import com.shopkart.ecommerce.dto.*;
import com.shopkart.ecommerce.model.User;
import com.shopkart.ecommerce.repository.UserRepository;
import com.shopkart.ecommerce.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(AuthRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already in use");
        var user = User.builder()
            .name(req.getName()).email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .role(User.Role.USER).build();
        userRepo.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return buildResponse(user, token);
    }

    public AuthResponse login(AuthRequest req) {
        var user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(User user, String token) {
        return new AuthResponse(token, new AuthResponse.UserInfo(
            user.getId(), user.getName(), user.getEmail(), user.getRole().name()));
    }
}
