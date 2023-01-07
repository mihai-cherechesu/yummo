package pweb.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
public class BasketProductDto {
    @Getter @Setter
    private Long id;

    @Getter @Setter
    private Long count;
}
