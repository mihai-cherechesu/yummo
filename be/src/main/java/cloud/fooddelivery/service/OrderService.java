package cloud.fooddelivery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cloud.fooddelivery.dto.OrderClientDto;
import cloud.fooddelivery.dto.OrderCourierDto;
import cloud.fooddelivery.exception.ResourceNotFoundException;
import cloud.fooddelivery.model.Order;
import cloud.fooddelivery.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public List<Order> getAllByCity(String city) {
        List<Order> cityOrders = orderRepository.findByCityOrderByCreatedAt(city);
        List<Order> otherOrders = orderRepository.findByCityIsNotOrderByCreatedAt(city);
        
        List<Order> result = new ArrayList<>(cityOrders);
        result.addAll(otherOrders);
        return result;
    }

    
    public Order getById(Long id) {
        return orderRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Order #" + id + " not found"));
    }
    
    public Order create(Order order) {
        return orderRepository.save(order);
    }

    public Order update(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = this.getById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void delete(Order order) {
        orderRepository.delete(order);
    }

    public List<OrderClientDto> getClientOrders(String email) {
        return orderRepository.getClientOrders(email);
    }

    public List<OrderCourierDto> getCourierOrders(String email) {
        return orderRepository.getCourierOrders(email);
    }
}
