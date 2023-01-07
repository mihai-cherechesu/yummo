package cloud.fooddelivery;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodDeliveryApplication {

	private static final Logger LOGGER = LogManager.getLogger(cloud.fooddelivery.FoodDeliveryApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(cloud.fooddelivery.FoodDeliveryApplication.class, args);
		LOGGER.info("salut");
		LOGGER.info("salut");
		LOGGER.info("salut");
		LOGGER.info("salut");
		LOGGER.info("salut");
	}
}
