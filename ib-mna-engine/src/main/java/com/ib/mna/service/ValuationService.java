package com.ib.mna.service;

import com.ib.domain.entity.SynergyItem;
import com.ib.domain.entity.ValuationResult;
import com.ib.domain.repository.SynergyRepository;
import com.ib.domain.repository.ValuationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

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
}
