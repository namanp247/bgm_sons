package com.bgmsons.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.bgmsons.backend.middleware.AuthMiddleware;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {
    private static final Logger logger = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        logger.info("Server is running on port 3000");
    }

    @Bean
    public FilterRegistrationBean<AuthMiddleware> authFilterRegistration(AuthMiddleware authMiddleware) {
        FilterRegistrationBean<AuthMiddleware> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(authMiddleware);
        registrationBean.addUrlPatterns("/api/admin/*");
        registrationBean.addUrlPatterns("/api/products");
        registrationBean.addUrlPatterns("/api/products/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }

}