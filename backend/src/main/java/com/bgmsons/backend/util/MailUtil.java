package com.bgmsons.backend.util;

import java.util.Map;

import org.springframework.mail.SimpleMailMessage;

/**
 * MailUtil
 */
public class MailUtil {

  public static SimpleMailMessage createEnquiryMessage(Map<String, String> formData) {
    SimpleMailMessage msgTemplate = new SimpleMailMessage();
    msgTemplate.setSubject("New Query Received");

    StringBuilder msgBuilder = new StringBuilder(
        String.format(
            """
            Hi Team,

            You have got a new enquiry.\n
            Enquirer\'s Name: %s
            Enquirer\'s Email Address: %s
            """,
            formData.get("name"),
            formData.get("email")
        )
    );

    if (formData.containsKey("phone")) {
      msgBuilder.append(
          String.format("Enquirer\'s Contact No.: %s\n", formData.get("phone"))
      );
    }

    if (formData.containsKey("company")) {
      msgBuilder.append(
          String.format("Enquirer\'s Company Name: %s\n", formData.get("company"))
      );
    }

    msgBuilder.append(
        String.format("Enquirer\'s Industry: %s\n", formData.get("industry"))
    );

    if (formData.containsKey("product-interest")) {
      msgBuilder.append(
          String.format("Product of Interest: %s\n", formData.get("product-interest"))
      );
    }


    msgBuilder.append(
        String.format(
          """
          Query:
      
          %s

          Thanks,
          BGM Auto Mailer
          """,

          formData.get("message")
        )
    );

    msgTemplate.setText(msgBuilder.toString());
    return msgTemplate;
  }

}
