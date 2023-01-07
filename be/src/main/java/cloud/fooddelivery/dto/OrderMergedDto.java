package cloud.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderMergedDto {
    private Long order_number;
    
    private String name;
    
    private String address;

    private String products;

    private String phone_number;

    private String status;
}
