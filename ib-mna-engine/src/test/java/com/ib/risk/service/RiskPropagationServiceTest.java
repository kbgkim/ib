package com.ib.risk.service;

import com.ib.domain.entity.AssetRiskLink;
import com.ib.domain.entity.GlobalAsset;
import com.ib.domain.repository.AssetRiskLinkRepository;
import com.ib.domain.repository.GlobalAssetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RiskPropagationServiceTest {

    @Mock
    private GlobalAssetRepository assetRepository;

    @Mock
    private AssetRiskLinkRepository linkRepository;

    @InjectMocks
    private RiskPropagationService propagationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("기본 리스크 전파 테스트 - 선형 전파")
    void simulatePropagation_LinearTest() {
        // Given
        String sourceId = "SOURCE_001";
        GlobalAsset source = GlobalAsset.builder().id(sourceId).name("Source Asset").build();
        GlobalAsset target = GlobalAsset.builder().id("TARGET_001").name("Target Asset").build();
        
        AssetRiskLink link = AssetRiskLink.builder()
                .sourceAssetId(sourceId)
                .targetAssetId("TARGET_001")
                .propagationWeight(0.5)
                .linkType("SUPPLY_CHAIN")
                .build();

        when(assetRepository.findById(sourceId)).thenReturn(Optional.of(source));
        when(assetRepository.findById("TARGET_001")).thenReturn(Optional.of(target));
        when(linkRepository.findBySourceAssetId(sourceId)).thenReturn(Arrays.asList(link));

        // When
        List<RiskPropagationService.PropagationResult> results = propagationService.simulatePropagation(sourceId, 20.0);

        // Then
        assertEquals(2, results.size());
        RiskPropagationService.PropagationResult targetRes = results.stream()
                .filter(r -> r.assetId().equals("TARGET_001"))
                .findFirst().orElseThrow();
        
        assertEquals(10.0, targetRes.riskImpact(), 0.1); // 20 * 0.5 = 10
    }

    @Test
    @DisplayName("비선형 리스크 증폭 테스트 - Sigmoid 임계점 초과")
    void simulatePropagation_NonLinearAmplificationTest() {
        // Given
        String sourceId = "SOURCE_HIGH";
        GlobalAsset source = GlobalAsset.builder().id(sourceId).name("High Risk Source").build();
        GlobalAsset target = GlobalAsset.builder().id("TARGET_002").name("Affected Asset").build();
        
        AssetRiskLink link = AssetRiskLink.builder()
                .sourceAssetId(sourceId)
                .targetAssetId("TARGET_002")
                .propagationWeight(0.8)
                .build();

        when(assetRepository.findById(sourceId)).thenReturn(Optional.of(source));
        when(assetRepository.findById("TARGET_002")).thenReturn(Optional.of(target));
        when(linkRepository.findBySourceAssetId(sourceId)).thenReturn(Arrays.asList(link));

        // When: 임계점(70)을 넘는 90의 리스크 충격 발생
        List<RiskPropagationService.PropagationResult> results = propagationService.simulatePropagation(sourceId, 90.0);

        // Then
        RiskPropagationService.PropagationResult targetRes = results.stream()
                .filter(r -> r.assetId().equals("TARGET_002"))
                .findFirst().orElseThrow();
        
        // 선형일 경우: 90 * 0.8 = 72
        // 비선형 증폭 시: 72 * Multiplier (약 1.5배 이상)
        assertTrue(targetRes.riskImpact() > 72.0, "Risk should be amplified non-linearly when source risk is high");
        assertTrue(targetRes.riskImpact() <= 100.0, "Risk capped at 100");
    }
}
