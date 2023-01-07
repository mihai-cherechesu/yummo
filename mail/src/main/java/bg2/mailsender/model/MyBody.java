package bg2.mailsender.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyBody {
    private String toEmail;

    private String subject;

    private String text;
}
