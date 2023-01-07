package pweb.medical.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {    
    @Getter @Setter
    private String clientEmail;

    @Getter @Setter
    private List<BasketProductDto> products;
}
