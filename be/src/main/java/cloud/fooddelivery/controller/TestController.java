package cloud.fooddelivery.controller;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class TestController {
    private static final Logger LOGGER = LogManager.getLogger(TestController.class);

    @GetMapping("/")
    public String hello() {
        LOGGER.info("Root API path has been called.");
        return "The generic, typical, overused 'Hello World'.";
    }
}
