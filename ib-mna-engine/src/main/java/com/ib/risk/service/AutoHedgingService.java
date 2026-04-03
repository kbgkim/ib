package com.ib.risk.service;

import com.ib.domain.entity.GlobalAsset;
import com.ib.domain.entity.HedgingStrategy;
import com.ib.domain.repository.GlobalAssetRepository;
import com.ib.domain.repository.HedgingStrategyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutoHedgingService {

    private final HedgingStrategyRepository strategyRepository;
    private final GlobalAssetRepository assetRepository;

    private static final double RISK_THRESHOLD = 60.0;
    private static final double SENTINEL_AUTO_THRESHOLD = 85.0;

    @Transactional
    public List<HedgingStrategy> generateRecommendations(String assetId, double currentRisk) {
        log.info("Generating hedging recommendations for asset: {} with risk: {}", assetId, currentRisk);
        
        Optional<GlobalAsset> assetOpt = assetRepository.findById(assetId);
        if (assetOpt.isEmpty() || currentRisk < RISK_THRESHOLD) {
            return new ArrayList<>();
        }

        GlobalAsset asset = assetOpt.get();
        List<HedgingStrategy> recommendations = new ArrayList<>();

        // 1. FX Hedging (Common for all non-local assets)
        recommendations.add(buildStrategy(assetId, "FX", "USD/KRW Forward", currentRisk * 0.15, 0.85));

        // 2. Asset Type Specific Hedging
        String type = asset.getAssetType();
        if ("ENERGY".equals(type)) {
            recommendations.add(buildStrategy(assetId, "COMMODITY", "Brent Oil Future", currentRisk * 0.12, 0.80));
        } else if ("INFRA".equals(type)) {
            recommendations.add(buildStrategy(assetId, "CREDIT", "Credit Default Swap (CDS)", currentRisk * 0.20, 0.90));
        }

        // 3. Interest Rate Swap (New Proposal)
        recommendations.add(buildStrategy(assetId, "INTEREST", "Interest Rate Swap (IRS)", currentRisk * 0.18, 0.88));

        // Check for Sentinel Mode execution
        if (currentRisk >= SENTINEL_AUTO_THRESHOLD) {
            log.warn("SENTINEL MODE: Risk exceeds {}, executing recommendations automatically", SENTINEL_AUTO_THRESHOLD);
            recommendations.forEach(r -> executeStrategy(r));
        } else {
            strategyRepository.saveAll(recommendations);
        }

        return recommendations;
    }

    @Transactional
    public HedgingStrategy executeStrategy(Long strategyId) {
        HedgingStrategy strategy = strategyRepository.findById(strategyId)
                .orElseThrow(() -> new IllegalArgumentException("Strategy not found: " + strategyId));
        return executeStrategy(strategy);
    }

    private HedgingStrategy executeStrategy(HedgingStrategy strategy) {
        log.info("Executing hedging strategy: {} for asset: {}", strategy.getProductName(), strategy.getAssetId());
        strategy.setStatus("EXECUTED");
        strategy.setExecutionTime(LocalDateTime.now());
        return strategyRepository.save(strategy);
    }

    private HedgingStrategy buildStrategy(String assetId, String type, String name, double reduction, double confidence) {
        return HedgingStrategy.builder()
                .assetId(assetId)
                .strategyType(type)
                .productName(name)
                .recommendedAmount(new BigDecimal("10000000")) // Mock amount
                .expectedRiskReduction(reduction)
                .confidenceScore(confidence)
                .status("RECOMMENDED")
                .createdAt(LocalDateTime.now())
                .build();
    }
}
