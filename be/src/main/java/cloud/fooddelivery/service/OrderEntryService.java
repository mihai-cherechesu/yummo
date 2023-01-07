package cloud.fooddelivery.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cloud.fooddelivery.model.Order;
import cloud.fooddelivery.model.OrderEntry;
import cloud.fooddelivery.repository.OrderEntryRepository;

@Service
public class OrderEntryService {
    
    @Autowired
    private OrderEntryRepository orderEntryRepository;

    public List<OrderEntry> getAllByOrder(Order order) {
        return orderEntryRepository.findByOrder(order);
    }

    public OrderEntry add(OrderEntry entry) {
        return orderEntryRepository.save(entry);
    }
}
