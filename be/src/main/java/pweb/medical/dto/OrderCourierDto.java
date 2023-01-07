package pweb.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCourierDto {
    private Long order_number;
    
    private String name;
    
    private String address;

    private String product_name;

    private Integer quantity;

    private String phone_number;

    private String status;
}
