package cloud.fooddelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cloud.fooddelivery.model.Order;
import cloud.fooddelivery.model.OrderEntry;

@Repository
public interface OrderEntryRepository extends JpaRepository<OrderEntry, Long>{
 
    List<OrderEntry> findByOrder(Order order);
}
