package pweb.medical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import pweb.medical.dto.OrderClientDto;
import pweb.medical.dto.OrderCourierDto;
import pweb.medical.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCityOrderByCreatedAt(String city);
    List<Order> findByCityIsNotOrderByCreatedAt(String city);

    @Query(nativeQuery = true)
    List<OrderClientDto> getClientOrders(String email);

    @Query(nativeQuery = true)
    List<OrderCourierDto> getCourierOrders(String email);
}
