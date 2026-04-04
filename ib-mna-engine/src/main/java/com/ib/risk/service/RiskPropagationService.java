package com.ib.risk.service;

import com.ib.domain.entity.AssetRiskLink;
import com.ib.domain.entity.GlobalAsset;
import com.ib.domain.repository.AssetRiskLinkRepository;
import com.ib.domain.repository.GlobalAssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RiskPropagationService {

    private final GlobalAssetRepository assetRepository;
    private final AssetRiskLinkRepository linkRepository;

    /**
     * 특정 자산의 리스크 충격이 전 세계 자산에 어떻게 전파되는지 시뮬레이션합니다.
     * @param sourceAssetId 충격이 시작된 자산 ID
     * @param shockAmount 충격량 (0-100)
     * @return 전파된 결과를 포함한 자산 리스트
     */
    @Cacheable(value = "riskPropagation", key = "#sourceAssetId + '-' + #shockAmount")
    @SuppressWarnings("null")
    public List<PropagationResult> simulatePropagation(String sourceAssetId, double shockAmount) {
        log.info("Simulating risk propagation for source: {} with shock: {}", sourceAssetId, shockAmount);
        List<PropagationResult> results = new ArrayList<>();
        GlobalAsset source = assetRepository.findById(sourceAssetId).orElseThrow();
        
        // 원천 자산 추가
        results.add(new PropagationResult(sourceAssetId, source.getName(), shockAmount, 0, "ORIGIN"));

        // 연결된 자산들 탐색 (1단계 전파 위주로 우선 구현)
        List<AssetRiskLink> links = linkRepository.findBySourceAssetId(sourceAssetId);
        
        for (AssetRiskLink link : links) {
            GlobalAsset target = assetRepository.findById(link.getTargetAssetId()).orElseThrow();
            
            // 비선형 증폭 로직 (Sigmoid-like)
            double multiplier = 1.0;
            if (shockAmount > 70) {
                multiplier = 1.0 + (1.0 / (1.0 + Math.exp(-0.2 * (shockAmount - 85))));
            }
            
            double propagatedRisk = shockAmount * link.getPropagationWeight() * multiplier;
            propagatedRisk = Math.min(100.0, propagatedRisk);
            
            results.add(new PropagationResult(
                target.getId(),
                target.getName(),
                propagatedRisk,
                1,
                link.getLinkType()
            ));
        }

        return results;
    }

    public record PropagationResult(
        String assetId,
        String assetName,
        double riskImpact,
        int distance,
        String relationType
    ) {}
}
