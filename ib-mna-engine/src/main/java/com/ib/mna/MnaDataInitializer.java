package com.ib.mna;

import com.ib.domain.entity.SynergyItem;
import com.ib.domain.repository.SynergyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class MnaDataInitializer implements CommandLineRunner {

    @Autowired
    private SynergyRepository synergyRepository;

    @Override
    public void run(String... args) throws Exception {
        if (synergyRepository.count() == 0) {
            String dealId = "DEAL-001";
            synergyRepository.saveAll(Arrays.asList(
                new SynergyItem(null, dealId, "COST", "Headcount Optimization", new BigDecimal("500.00"), 1),
                new SynergyItem(null, dealId, "REVENUE", "Cross-selling Strategy", new BigDecimal("300.00"), 2),
                new SynergyItem(null, dealId, "FINANCIAL", "Tax Shield Re-valuation", new BigDecimal("200.00"), 1)
            ));
            System.out.println(">>> M&A Seed Data (DEAL-001) Initialized in PostgreSQL.");
        }
    }
}
