package com.ib.risk.service;

import com.ib.domain.entity.GlobalAsset;
import com.ib.domain.entity.HedgingStrategy;
import com.ib.domain.repository.GlobalAssetRepository;
import com.ib.domain.repository.HedgingStrategyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AutoHedgingServiceTest {

    @Mock
    private HedgingStrategyRepository strategyRepository;

    @Mock
    private GlobalAssetRepository assetRepository;

    @InjectMocks
    private AutoHedgingService autoHedgingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("리스크 60 이상일 때 헤징 추천 생성 테스트")
    void generateRecommendations_SuccessTest() {
        // Given
        String assetId = "ASSET_001";
        GlobalAsset asset = GlobalAsset.builder().id(assetId).assetType("ENERGY").build();
        when(assetRepository.findById(assetId)).thenReturn(Optional.of(asset));

        // When
        List<HedgingStrategy> result = autoHedgingService.generateRecommendations(assetId, 75.0);

        // Then
        assertFalse(result.isEmpty());
        assertTrue(result.stream().anyMatch(s -> s.getStrategyType().equals("FX")));
        assertTrue(result.stream().anyMatch(s -> s.getStrategyType().equals("INTEREST"))); // IRS 추가 확인
        assertEquals("RECOMMENDED", result.get(0).getStatus());
        verify(strategyRepository, times(1)).saveAll(anyList());
    }

    @Test
    @DisplayName("리스크 85 이상일 때 Sentinel Mode(자동 실행) 테스트")
    void generateRecommendations_SentinelModeTest() {
        // Given
        String assetId = "ASSET_HIGH";
        GlobalAsset asset = GlobalAsset.builder().id(assetId).assetType("INFRA").build();
        when(assetRepository.findById(assetId)).thenReturn(Optional.of(asset));
        when(strategyRepository.save(any(HedgingStrategy.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        List<HedgingStrategy> result = autoHedgingService.generateRecommendations(assetId, 90.0);

        // Then
        assertFalse(result.isEmpty());
        // Sentinel 모드에서는 즉시 EXECUTED 상태로 저장되어야 함 (Service 구현 상 내부 루프에서 save 호출)
        assertTrue(result.stream().allMatch(s -> s.getStatus().equals("EXECUTED")));
    }

    @Test
    @DisplayName("전략 실행(Execute) 기능 테스트")
    void executeStrategy_Test() {
        // Given
        Long strategyId = 100L;
        HedgingStrategy strategy = HedgingStrategy.builder()
                .id(strategyId)
                .status("RECOMMENDED")
                .productName("FX Swap")
                .build();
        
        when(strategyRepository.findById(strategyId)).thenReturn(Optional.of(strategy));
        when(strategyRepository.save(any(HedgingStrategy.class))).thenReturn(strategy);

        // When
        HedgingStrategy executed = autoHedgingService.executeStrategy(strategyId);

        // Then
        assertEquals("EXECUTED", executed.getStatus());
        assertNotNull(executed.getExecutionTime());
        verify(strategyRepository, times(1)).save(strategy);
    }
}
