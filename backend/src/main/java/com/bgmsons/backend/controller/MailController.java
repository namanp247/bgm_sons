package com.bgmsons.backend.controller;

import static com.bgmsons.backend.util.MailUtil.createEnquiryMessage;
import static com.bgmsons.backend.util.MailUtil.createProductEnquiryMessage;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.mail.internet.MimeMessage;

/**
 * MailController
 */
@Controller
@RequestMapping("api/mail")
public class MailController {

  private static final Logger logger = LoggerFactory.getLogger(MailController.class);

  @Autowired
  private JavaMailSender javaMailSender;

  @PostMapping("/send-enquiry")
  public ResponseEntity<?> sendEnquiry(@RequestBody Map<String, String> requestBody) {

    try {

      MimeMessage mimeMessage = javaMailSender.createMimeMessage();
      MimeMessageHelper msgHelper = new MimeMessageHelper(mimeMessage, true);
      msgHelper.setSubject("You've got a New Enquiry!!");
      msgHelper.setTo(System.getenv("BGM_MAIL_ID"));
      msgHelper.setFrom(System.getenv("BGM_SMTP_USERNAME") + "@gmail.com");
      msgHelper.setText(createEnquiryMessage(requestBody),true);
      javaMailSender.send(mimeMessage);
      return ResponseEntity.ok().build();

    } catch (Exception e) {
      logger.error(e.toString());
      return ResponseEntity.internalServerError().build();
    }

  }

  @PostMapping("/send-product-enquiry")
  public ResponseEntity<?> productEnquiry(@RequestBody Map<String, String> requestBody) {
    
    try {

      MimeMessage mimeMessage = javaMailSender.createMimeMessage();
      MimeMessageHelper msgHelper = new MimeMessageHelper(mimeMessage, true);
      msgHelper.setSubject("You've Got a New Product Enquiry!!");
      msgHelper.setTo(System.getenv("BGM_MAIL_ID"));
      msgHelper.setFrom(System.getenv("BGM_SMTP_USERNAME") + "@gmail.com");
      msgHelper.setText(createProductEnquiryMessage(requestBody), true);
      javaMailSender.send(mimeMessage);
      return ResponseEntity.ok().build();

    } catch (Exception e) {
      System.out.println(e);
      return ResponseEntity.internalServerError().build();
    }

  }
}
