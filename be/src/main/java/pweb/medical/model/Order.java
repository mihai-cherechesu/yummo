package pweb.medical.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedNativeQueries;
import javax.persistence.NamedNativeQuery;
import javax.persistence.OneToMany;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pweb.medical.dto.OrderClientDto;
import pweb.medical.dto.OrderCourierDto;

import javax.persistence.NamedNativeQuery;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.SqlResultSetMappings;
import javax.persistence.ConstructorResult;
import javax.persistence.ColumnResult;

@NamedNativeQueries({
    @NamedNativeQuery(name = "Order.getClientOrders",
    query =     
    "SELECT o.id AS order_number, " +
        "u.first_name || ' ' || u.last_name AS name, " +
        "COALESCE(o.address, '') || ', ' || COALESCE(o.city, '') AS address, " +
        "p.name AS product_name, " +
        "i.quantity AS quantity, " +
        "u.phone_number AS phone_number, " +
        "o.status AS status " +
    "FROM orders o " +
    "INNER JOIN users u ON o.courier_email = u.email " +
    "INNER JOIN order_items i " +
        "INNER JOIN products p ON i.product_id = p.id " +
    "ON o.id = i.order_id " +
    "WHERE o.client_email = :email",
    resultSetMapping = "Mapping.OrderClientDto"),

    @NamedNativeQuery(name = "Order.getCourierOrders",
    query = 
    "SELECT o.id AS order_number, " +
        "u.first_name || ' ' || u.last_name AS name, " +
        "COALESCE(o.address, '') || ', ' || COALESCE(o.city, '') AS address, " +
        "p.name AS product_name, " +
        "i.quantity AS quantity, " +
        "u.phone_number AS phone_number, " +
        "o.status AS status " +
    "FROM orders o " +
    "INNER JOIN users u ON o.client_email = u.email " +
    "INNER JOIN order_items i " +
        "INNER JOIN products p ON i.product_id = p.id " +
    "ON o.id = i.order_id " +
    "WHERE o.courier_email = :email OR o.courier_email IS NULL",
    resultSetMapping = "Mapping.OrderCourierDto")
})

@SqlResultSetMappings({
    @SqlResultSetMapping(name = "Mapping.OrderClientDto",
        classes = @ConstructorResult(targetClass = OrderClientDto.class,
                                    columns = { @ColumnResult(name = "order_number", type = Long.class),
                                                @ColumnResult(name = "name", type = String.class),
                                                @ColumnResult(name = "address", type = String.class),
                                                @ColumnResult(name = "product_name", type = String.class),
                                                @ColumnResult(name = "quantity", type = Integer.class),
                                                @ColumnResult(name = "phone_number", type = String.class),
                                                @ColumnResult(name = "status", type = String.class)
                                            }
                                    )
    ),
    @SqlResultSetMapping(name = "Mapping.OrderCourierDto",
    classes = @ConstructorResult(targetClass = OrderCourierDto.class,
                                columns = { @ColumnResult(name = "order_number", type = Long.class),
                                            @ColumnResult(name = "name", type = String.class),
                                            @ColumnResult(name = "address", type = String.class),
                                            @ColumnResult(name = "product_name", type = String.class),
                                            @ColumnResult(name = "quantity", type = Integer.class),
                                            @ColumnResult(name = "phone_number", type = String.class),
                                            @ColumnResult(name = "status", type = String.class)
                                        }
                                )
    )
})

@Entity(name = "Order")
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Getter @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter @Setter
    @Column(name = "status")
    private String status;

    @Getter @Setter
    @Column(name = "created_at")
    private Date createdAt;

    @Getter @Setter
    @Column(name = "address")
    private String address;

    @Getter @Setter
    @Column(name = "city")
    private String city;

    @Getter @Setter
    @Column(name = "client_email")
    private String clientEmail;

    @Getter @Setter
    @Column(name = "courier_email")
    private String courierEmail = null;

    @Getter @Setter
    @OneToMany(targetEntity = OrderEntry.class, mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonProperty(access = Access.WRITE_ONLY)
    private List<OrderEntry> entries = new ArrayList<>();

    public String getDescription() {
        String result = "";

        for (OrderEntry entry : entries)
            result += entry.getQuantity() + " x " + entry.getProduct().getName() + "\n";

        return result;
    }

    public void addEntry(OrderEntry entry) {
        this.entries.add(entry);
    }
}
