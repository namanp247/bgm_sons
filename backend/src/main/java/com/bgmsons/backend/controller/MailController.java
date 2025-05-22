package com.bgmsons.backend.controller;

import static com.bgmsons.backend.util.MailUtil.createEnquiryMessage;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * MailController
 */
@Controller
@RequestMapping("api/mail")
public class MailController {

  @Autowired
  private JavaMailSender javaMailSender;

  @Autowired
  private Environment env;

  @PostMapping("/send-enquiry")
  public ResponseEntity<?> sendEnquiry(@RequestBody Map<String, String> requestBody) {
    SimpleMailMessage mailMessage = createEnquiryMessage(requestBody);
    mailMessage.setFrom(
        env.getProperty("spring.mail.username") + "@gmail.com"
    );
    mailMessage.setTo(
        env.getProperty("bgm.email.id")
    );
    javaMailSender.send(mailMessage);
    return ResponseEntity.ok().build();
  }
}
