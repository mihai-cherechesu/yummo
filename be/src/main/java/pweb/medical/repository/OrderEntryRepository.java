package pweb.medical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pweb.medical.model.Order;
import pweb.medical.model.OrderEntry;

@Repository
public interface OrderEntryRepository extends JpaRepository<OrderEntry, Long>{
 
    List<OrderEntry> findByOrder(Order order);
}
