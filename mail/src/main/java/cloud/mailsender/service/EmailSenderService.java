package cloud.mailsender.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage() {{
            setFrom("bogdandrei04@gmail.com");
            setTo(toEmail);
            setText(body);
            setSubject(subject);
        }};

        mailSender.send(message);

        System.out.println("Mail sent successfully...");
    }
}
