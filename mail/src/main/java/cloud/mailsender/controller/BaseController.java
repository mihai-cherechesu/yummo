package cloud.mailsender.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cloud.mailsender.model.MyBody;
import cloud.mailsender.service.EmailSenderService;

@RestController
@RequestMapping("/email")
public class BaseController {
    
    @Autowired
    private EmailSenderService emailSenderService;

    @PostMapping("/post")
    public String sendMail(@RequestBody MyBody body) {
        emailSenderService.sendEmail(
            body.getToEmail(),
            body.getSubject(),
            body.getText()
        );

        return "Success!";
    }

    @KafkaListener(topics = "transaction-1", groupId = "group-1")
    public void listener(String stringBody) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        MyBody body = objectMapper.readValue(stringBody, MyBody.class);

        emailSenderService.sendEmail(
            body.getToEmail(),
            body.getSubject(),
            body.getText()
        );
    }

}
