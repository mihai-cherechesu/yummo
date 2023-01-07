package cloud.fooddelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import cloud.fooddelivery.dto.OrderClientDto;
import cloud.fooddelivery.dto.OrderCourierDto;
import cloud.fooddelivery.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCityOrderByCreatedAt(String city);
    List<Order> findByCityIsNotOrderByCreatedAt(String city);

    @Query(nativeQuery = true)
    List<OrderClientDto> getClientOrders(String email);

    @Query(nativeQuery = true)
    List<OrderCourierDto> getCourierOrders(String email);
}
