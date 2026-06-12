package com.placement.system.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Expose local upload folder for static serving
        registry.addResourceHandler("/uploads/resumes/**")
                .addResourceLocations("file:uploads/resumes/");
    }
}
