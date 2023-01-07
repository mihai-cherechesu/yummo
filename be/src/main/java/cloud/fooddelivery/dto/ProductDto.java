package cloud.fooddelivery.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    @Getter @Setter
    private String name;

    @Getter @Setter
    private String photoURL;

    @Getter @Setter
    private String status;

    @Getter @Setter
    private Integer leftStock;

    @Getter @Setter
    private List<String> categoryNames;
}
