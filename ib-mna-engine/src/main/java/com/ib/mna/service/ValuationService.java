package com.ib.mna.service;

import com.ib.domain.entity.SynergyItem;
import com.ib.domain.entity.ValuationResult;
import com.ib.domain.repository.SynergyRepository;
import com.ib.domain.repository.ValuationRepository;
import com.ib.mna.dto.ValuationBridgeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@Transactional
public class ValuationService {

    @Autowired
    private SynergyRepository synergyRepository;

    @Autowired
    private ValuationRepository valuationRepository;

    /**
     * DCF (Discounted Cash Flow) calculation for Synergies
     */
    public BigDecimal calculateSynergyNPV(String dealId, List<SynergyItem> items, BigDecimal wacc, int years) {
        BigDecimal totalNPV = BigDecimal.ZERO;
        
        // Save synergies to DB for persistence
        synergyRepository.saveAll(items);

        for (int t = 1; t <= years; t++) {
            final int year = t;
            BigDecimal yearlyCashFlow = items.stream()
                .filter(item -> item.getRealizationYear() == year)
                .map(SynergyItem::getEstimatedValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal denominator = BigDecimal.ONE.add(wacc).pow(year);
            BigDecimal pv = yearlyCashFlow.divide(denominator, 4, RoundingMode.HALF_UP);
            totalNPV = totalNPV.add(pv);
        }
        return totalNPV;
    }

    public List<SynergyItem> getSynergiesByDeal(String dealId) {
        return synergyRepository.findByDealId(dealId);
    }

    public BigDecimal calculateMultipleValue(BigDecimal runRateEbitda, BigDecimal peerMultiple) {
        return runRateEbitda.multiply(peerMultiple);
    }

    public BigDecimal calculateWeightedValue(BigDecimal dcfValue, BigDecimal multipleValue, BigDecimal dcfWeight) {
        BigDecimal multipleWeight = BigDecimal.ONE.subtract(dcfWeight);
        return dcfValue.multiply(dcfWeight).add(multipleValue.multiply(multipleWeight));
    }

    @Autowired
    private MarketDataService marketDataService;

    /**
     * Calculate 5 points for Waterfall Bridge with Scenario Multiplier
     */
    public ValuationBridgeResponse calculateValuationBridge(List<SynergyItem> items, BigDecimal multiplier) {
        BigDecimal baseValue = new BigDecimal("2000"); // Fixed starting value
        
        // Dynamic WACC based on real-time US 10Y Yield + 5% Equity Risk Premium
        BigDecimal marketYield = marketDataService.getLatestData().getUst10y().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal wacc = marketYield.add(new BigDecimal("0.05")); 
        
        int years = 3;

        BigDecimal costNPV = calculateCategoryNPV(items, "COST", wacc, years).multiply(multiplier);
        BigDecimal revenueNPV = calculateCategoryNPV(items, "REVENUE", wacc, years).multiply(multiplier);
        BigDecimal integrationNPV = calculateCategoryNPV(items, "FINANCIAL", wacc, years); 
        
        // Integration costs are usually negative in the bridge
        if (integrationNPV.compareTo(BigDecimal.ZERO) > 0) {
            integrationNPV = integrationNPV.negate();
        }

        BigDecimal postDealValue = baseValue.add(costNPV).add(revenueNPV).add(integrationNPV);

        return ValuationBridgeResponse.builder()
                .baseValue(baseValue)
                .costSynergy(costNPV.setScale(2, RoundingMode.HALF_UP))
                .revenueSynergy(revenueNPV.setScale(2, RoundingMode.HALF_UP))
                .integrationCost(integrationNPV.setScale(2, RoundingMode.HALF_UP))
                .postDealValue(postDealValue.setScale(2, RoundingMode.HALF_UP))
                .build();
    }

    public ValuationBridgeResponse calculateValuationBridge(List<SynergyItem> items) {
        return calculateValuationBridge(items, BigDecimal.ONE);
    }

    /**
     * Generate all three scenarios (Bear, Base, Bull) for the bridge
     */
    public Map<String, ValuationBridgeResponse> calculateAllScenarios(List<SynergyItem> items) {
        Map<String, ValuationBridgeResponse> scenarios = new HashMap<>();
        
        scenarios.put("BEAR", calculateValuationBridge(items, new BigDecimal("0.70")));
        scenarios.put("BASE", calculateValuationBridge(items, new BigDecimal("1.00")));
        scenarios.put("BULL", calculateValuationBridge(items, new BigDecimal("1.30")));
        
        return scenarios;
    }

    private BigDecimal calculateCategoryNPV(List<SynergyItem> items, String category, BigDecimal wacc, int years) {
        List<SynergyItem> filtered = items.stream()
                .filter(i -> category.equalsIgnoreCase(i.getCategory()))
                .toList();
        if (filtered.isEmpty()) return BigDecimal.ZERO;
        
        return calculateSynergyNPV("CALC", filtered, wacc, years);
    }
}
