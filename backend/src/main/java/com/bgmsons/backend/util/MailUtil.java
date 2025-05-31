package com.bgmsons.backend.util;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.bgmsons.backend.model.Product;

/**
 * MailUtil
 */
public class MailUtil {

  private static final String TEMPLATE_PATH = "enquiry-template.html";

  private static Document getHtmlDocument() throws IOException {
    Resource resource = new ClassPathResource(TEMPLATE_PATH);
    File templateFile = resource.getFile();
    return Jsoup.parse(templateFile);
  }

  private static Element createTableRow(Document htmlDoc, String key, String value){
    Element tableRow = htmlDoc.createElement("tr");

    Element tableDataKey = htmlDoc.createElement("td");
    tableDataKey.attr("style", "padding: 10px; border: 1px solid #dddddd; width: 30%; background-color: #f8f8f8; font-weight: bold;");
    tableDataKey.text(key);

    Element tableDataValue = htmlDoc.createElement("td");
    tableDataValue.attr("style","padding: 10px; border: 1px solid #dddddd;");
    tableDataValue.text(value);

    tableRow.appendChild(tableDataKey);
    tableRow.appendChild(tableDataValue);

    return tableRow; 
  }

  public static String createProductEnquiryMessage(Map<String, String> formData) throws IOException {
    Document htmlDoc = getHtmlDocument();

    htmlDoc.getElementById("enquiry-type").text("New Product Enquiry");

    String customerName = formData.get("name");
    String customerEmail = formData.get("email");
    String customerContact = formData.get("phone");
    String message = formData.get("message");

    Element dateElement = htmlDoc.getElementById("enq-date");
    dateElement.text(new Date().toString());

    if(!customerName.isEmpty()){
      htmlDoc.getElementById("cust-name").text(customerName);
    }

    if(!customerEmail.isEmpty()){
      htmlDoc.getElementById("reply-to").attr("href", "mailto:" + customerEmail);
    }

    if(!customerContact.isEmpty()){
      htmlDoc.getElementById("call-now").attr("href", "tel:+91" + customerContact);
    }

    if(!message.isEmpty()){
      htmlDoc.getElementById("message").text(formData.get("message"));
    }

    Element customerNameRow = htmlDoc.getElementById("cust-name");
    customerNameRow.after(createTableRow(htmlDoc, "Product Link", "http://" + System.getenv("BGM_DOMAIN") + "/products/" + formData.get("productId")));

    return htmlDoc.toString();
  }

  public static String createEnquiryMessage(Map<String, String> formData) throws IOException {
    Document htmlDoc = getHtmlDocument();

    htmlDoc.getElementById("enquiry-type").text("New Enquiry");

    String customerName = formData.get("name");
    String customerEmail = formData.get("email");
    String customerContact = formData.get("phone");
    String companyName = formData.get("company");
    String productInterest = formData.get("productInterest");
    String industryName = formData.get("industry");
    String message = formData.get("message");

    Element dateElement = htmlDoc.getElementById("enq-date");
    dateElement.text(new Date().toString());

    if(!customerName.isEmpty()){
      htmlDoc.getElementById("cust-name").text(customerName);
    }

    if(!customerEmail.isEmpty()){
      htmlDoc.getElementById("reply-to").attr("href", "mailto:" + customerEmail);
    }

    if(!customerContact.isEmpty()){
      htmlDoc.getElementById("call-now").attr("href", "tel:+91" + customerContact);
    }
    
    if(!message.isEmpty()){
      htmlDoc.getElementById("message").text(formData.get("message"));
    }

    if (!companyName.isEmpty()) {
      Element companyRow = createTableRow(htmlDoc, "Company", companyName);
      dateElement.after(companyRow);
    }

    if (!productInterest.equals("Select Product Interest") && !productInterest.isEmpty()) {
      Element productInterestRow = createTableRow(htmlDoc, "Product Interest", productInterest);
      dateElement.after(productInterestRow);
    }

    if (!industryName.equals("Select Industry") && !industryName.isEmpty()) {
      Element industryRow = createTableRow(htmlDoc, "Industry", industryName);
      dateElement.after(industryRow);
    }


    return htmlDoc.toString();
  }

}
