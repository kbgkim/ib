package com.ib.mna;

import com.ib.domain.entity.SynergyItem;
import com.ib.domain.repository.SynergyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class MnaDataInitializer implements CommandLineRunner {

    private final SynergyRepository synergyRepository;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) throws Exception {
        if (synergyRepository.count() == 0) {
            String dealId = "DEAL-001";
            synergyRepository.saveAll(List.of(
                new SynergyItem(null, dealId, "COST", "Headcount Optimization", new BigDecimal("500.00"), 1),
                new SynergyItem(null, dealId, "REVENUE", "Cross-selling Strategy", new BigDecimal("300.00"), 2),
                new SynergyItem(null, dealId, "FINANCIAL", "Tax Shield Re-valuation", new BigDecimal("200.00"), 1)
            ));
            log.info(">>> M&A Seed Data (DEAL-001) Initialized in PostgreSQL.");
        }
    }
}
