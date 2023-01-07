package pweb.medical.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pweb.medical.model.Order;
import pweb.medical.model.OrderEntry;
import pweb.medical.repository.OrderEntryRepository;

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
