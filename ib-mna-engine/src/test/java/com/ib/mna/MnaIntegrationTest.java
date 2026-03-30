package com.ib.mna;

import com.ib.mna.service.ValuationService;
import com.ib.domain.entity.SynergyItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class MnaIntegrationTest {

    @Autowired
    private ValuationService valuationService;

    @Test
    public void testSynergyPersistenceAndCalculation() {
        String dealId = "DEAL-TEST-001";
        SynergyItem item = new SynergyItem(null, dealId, "COST", "Test Synergy", new BigDecimal("1000.00"), 1);
        
        // Calculate and Save
        BigDecimal npv = valuationService.calculateSynergyNPV(dealId, Collections.singletonList(item), new BigDecimal("0.10"), 1);
        
        // Verify Persistence
        List<SynergyItem> savedItems = valuationService.getSynergiesByDeal(dealId);
        assertFalse(savedItems.isEmpty());
        assertEquals(dealId, savedItems.get(0).getDealId());
        
        // Verify NPV (1000 / 1.10 = 909.0909)
        assertTrue(npv.compareTo(new BigDecimal("909.0909")) == 0);
    }
}
