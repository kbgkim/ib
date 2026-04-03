package com.ib.mna;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.ib")
@EntityScan("com.ib.domain.entity")
@EnableJpaRepositories("com.ib.domain.repository")
@EnableScheduling
@EnableCaching
@EnableAspectJAutoProxy
public class MnaEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(MnaEngineApplication.class, args);
    }
}
