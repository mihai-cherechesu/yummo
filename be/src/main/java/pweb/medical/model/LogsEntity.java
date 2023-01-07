package pweb.medical.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity(name = "logs")
@Table(name = "logs")
@NoArgsConstructor
@AllArgsConstructor
public class LogsEntity {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "log_date")
    private Date logDate;

    @Column
    private String logger;

    @Column(name = "log_level")
    private String logLevel;

    @Column(columnDefinition = "text", length = 20480)
    private String message;

}
