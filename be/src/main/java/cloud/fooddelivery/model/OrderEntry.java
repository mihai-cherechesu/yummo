package cloud.fooddelivery.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OrderEntry")
@Table(name = "order_items")
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntry {
    
    @Getter @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter @Setter
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Getter @Setter
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Getter @Setter
    @Column(name = "quantity", nullable = false)
    private Long quantity;
}
