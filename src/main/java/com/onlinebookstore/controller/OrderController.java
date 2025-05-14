package com.onlinebookstore.controller;

import com.onlinebookstore.model.Order;
import com.onlinebookstore.model.User;
import com.onlinebookstore.service.OrderService;
import com.onlinebookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @Autowired
    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).build();
        }
        List<Order> orders = orderService.getOrdersByUser(user);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Order order) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).build();
        }
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        Order savedOrder = orderService.saveOrder(order);
        return ResponseEntity.ok(savedOrder);
    }
}
