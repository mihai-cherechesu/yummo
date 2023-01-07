package pweb.medical;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedicalApplication {

	private static final Logger LOGGER = LogManager.getLogger(MedicalApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(MedicalApplication.class, args);
		LOGGER.info("salut");
		LOGGER.info("salut");
		LOGGER.info("salut");
		LOGGER.info("salut");
		LOGGER.info("salut");
	}
}
