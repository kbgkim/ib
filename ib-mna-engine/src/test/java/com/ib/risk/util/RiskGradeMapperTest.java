package com.ib.risk.util;

import com.ib.domain.risk.RiskGrade;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RiskGradeMapperTest {

    @Test
    @DisplayName("점수에 따른 정확한 리스크 등급 매핑 테스트")
    void shouldMapScoreToCorrectGrade() {
        assertEquals(RiskGrade.AAA, RiskGradeMapper.toGrade(95.5));
        assertEquals(RiskGrade.AA, RiskGradeMapper.toGrade(85.0));
        assertEquals(RiskGrade.A, RiskGradeMapper.toGrade(70.0));
        assertEquals(RiskGrade.B, RiskGradeMapper.toGrade(60.0));
        assertEquals(RiskGrade.D, RiskGradeMapper.toGrade(40.0));
        assertEquals(RiskGrade.D, RiskGradeMapper.toGrade(-5.0));
        assertEquals(RiskGrade.AAA, RiskGradeMapper.toGrade(105.0));
    }
}
