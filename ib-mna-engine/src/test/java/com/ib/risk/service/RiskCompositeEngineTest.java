package com.ib.risk.service;

import com.ib.risk.model.RiskData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RiskCompositeEngineTest {

    private RiskCompositeEngine engine;

    @BeforeEach
    void setUp() {
        engine = new RiskCompositeEngine();
    }

    @Test
    @DisplayName("가중치 합산 리스크 점수 계산 테스트 (정상 범위)")
    void shouldCalculateCorrectTotalScore() {
        // Fin(40%): 80, Leg(30%): 70, Ops(20%): 90, Sec(10%): 60
        // (80*0.4) + (70*0.3) + (90*0.2) + (60*0.1) = 32 + 21 + 18 + 6 = 77
        RiskData data = new RiskData(80, 70, 90, 60);
        double total = engine.calculateTotalScore(data);
        
        assertEquals(77.0, total, 0.001);
    }

    @Test
    @DisplayName("모든 점수가 100일 때 최종 점수 100 확인")
    void shouldReturn100WhenAllScoresAreMax() {
        RiskData data = new RiskData(100, 100, 100, 100);
        assertEquals(100.0, engine.calculateTotalScore(data));
    }
}
