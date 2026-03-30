package com.ib.mna;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.ib")
@EntityScan("com.ib.domain.entity")
@EnableJpaRepositories("com.ib.domain.repository")
public class MnaEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(MnaEngineApplication.class, args);
    }
}
