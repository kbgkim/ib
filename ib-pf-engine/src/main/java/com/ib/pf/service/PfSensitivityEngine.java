package com.ib.pf.service;

import com.ib.pf.dto.PfSensitivityResponse;
import com.ib.pf.dto.PfMetricsResponse;
import com.ib.pf.model.PfCashFlow;
import com.ib.pf.model.PfTranche;
import com.ib.pf.repository.PfCashFlowRepository;
import com.ib.pf.repository.PfTrancheRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * PF 민감도 분석 엔진 (Sensitivity Analysis)
 *
 * 주요 입력 변수별로 ±변화율을 적용하고 DSCR 변동 폭을 계산합니다.
 * 결과는 Tornado 차트로 시각화됩니다.
 *
 * 분석 변수:
 *  - Revenue (매출)
 *  - OpEx (운영비용)
 *  - InterestRate (금리)
 *  - Capex (건설비)
 */
@Service
public class PfSensitivityEngine {

    private static final double[] DELTA_STEPS = {-0.20, -0.10, -0.05, 0.05, 0.10, 0.20};

    private final PfCashFlowRepository cashFlowRepo;
    private final PfTrancheRepository trancheRepo;
    private final PfMetricsEngine metricsEngine;

    public PfSensitivityEngine(PfCashFlowRepository cashFlowRepo,
                               PfTrancheRepository trancheRepo,
                               PfMetricsEngine metricsEngine) {
        this.cashFlowRepo = cashFlowRepo;
        this.trancheRepo = trancheRepo;
        this.metricsEngine = metricsEngine;
    }

    public List<PfSensitivityResponse> analyze(String projectId) {
        // 베이스라인 DSCR
        PfMetricsResponse baseline = metricsEngine.calculate(projectId);
        double baseDscr = baseline.getMinDscr().doubleValue();

        List<PfSensitivityResponse> results = new ArrayList<>();

        // 매출 민감도
        results.add(analyzeVariable(projectId, "Revenue (매출)", baseDscr, "REVENUE"));
        // 운영비용 민감도
        results.add(analyzeVariable(projectId, "OpEx (운영비용)", baseDscr, "OPEX"));
        // 금리 민감도
        results.add(analyzeVariable(projectId, "Interest Rate (금리)", baseDscr, "INTEREST"));
        // 건설비(Capex) 민감도
        results.add(analyzeVariable(projectId, "Capex (건설비)", baseDscr, "CAPEX"));

        return results;
    }

    private PfSensitivityResponse analyzeVariable(String projectId, String varName,
                                                   double baseDscr, String type) {
        List<PfCashFlow> cashFlows = cashFlowRepo.findByProjectIdOrderByProjectYear(projectId);
        List<PfTranche> tranches = trancheRepo.findByProjectIdOrderBySeniority(projectId);

        // 베이스 연간 DS
        BigDecimal baseAnnualDS = calcAnnualDS(tranches);

        // -20% 시나리오
        double dscrAt20Down = calcDscrWithDelta(cashFlows, baseAnnualDS, type, -0.20, tranches);
        // +20% 시나리오
        double dscrAt20Up = calcDscrWithDelta(cashFlows, baseAnnualDS, type, 0.20, tranches);

        double impact = Math.abs(dscrAt20Up - dscrAt20Down);
        double dscrDown = dscrAt20Down - baseDscr;
        double dscrUp = dscrAt20Up - baseDscr;

        return PfSensitivityResponse.builder()
            .variable(varName)
            .baseDscr(baseDscr)
            .dscrAt20PercentDown(dscrAt20Down)
            .dscrAt20PercentUp(dscrAt20Up)
            .sensitivityRange(impact)
            .dscrChangeDown(dscrDown)
            .dscrChangeUp(dscrUp)
            .build();
    }

    private double calcDscrWithDelta(List<PfCashFlow> cashFlows, BigDecimal baseAnnualDS,
                                     String type, double delta, List<PfTranche> tranches) {
        BigDecimal annualDS = baseAnnualDS;
        if ("INTEREST".equals(type)) {
            // 금리 변화 시 DS 재계산
            annualDS = recalcAnnualDSWithInterestDelta(tranches, delta);
        } else if ("CAPEX".equals(type)) {
            // CAPEX 변화 시 부채 원금 비례 변화 가정하여 DS 재계산
            annualDS = recalcAnnualDSWithCapexDelta(tranches, delta);
        }

        double totalCfads = 0;
        int count = 0;
        for (PfCashFlow cf : cashFlows) {
            if (cf.getCfads().compareTo(BigDecimal.ZERO) <= 0) continue;

            double cfads = cf.getCfads().doubleValue();
            if ("REVENUE".equals(type)) {
                double adjustedRevenue = cf.getRevenue().doubleValue() * (1 + delta);
                cfads = adjustedRevenue - cf.getOpex().doubleValue() - cf.getTaxAmount().doubleValue();
            } else if ("OPEX".equals(type)) {
                double adjustedOpex = cf.getOpex().doubleValue() * (1 + delta);
                cfads = cf.getRevenue().doubleValue() - adjustedOpex - cf.getTaxAmount().doubleValue();
            } else if ("CAPEX".equals(type)) {
                // CAPEX 민감도: 연간 DS에 직접 반영 (부채 규모의 비례적 변화 가정)
                // 이미 아래에서 recalcAnnualDSWithCapexDelta 로 처리됨
                cfads = cf.getCfads().doubleValue();
            }
            totalCfads += cfads;
            count++;
        }

        double avgCfads = count > 0 ? totalCfads / count : 0;
        double ds = annualDS.doubleValue();
        return ds == 0 ? 0 : Math.round((avgCfads / ds) * 10000.0) / 10000.0;
    }

    private BigDecimal recalcAnnualDSWithInterestDelta(List<PfTranche> tranches, double delta) {
        return tranches.stream()
            .filter(t -> !"EQUITY".equals(t.getSeniority()))
            .map(t -> {
                double newRate = t.getInterestRate().doubleValue() * (1 + delta);
                BigDecimal interest = t.getPrincipal().multiply(BigDecimal.valueOf(newRate));
                int repayYears = t.getTenure() - t.getGracePeriod();
                BigDecimal principal = repayYears > 0
                    ? t.getPrincipal().divide(BigDecimal.valueOf(repayYears), 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
                return interest.add(principal);
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal recalcAnnualDSWithCapexDelta(List<PfTranche> tranches, double delta) {
        return tranches.stream()
            .filter(t -> !"EQUITY".equals(t.getSeniority()))
            .map(t -> {
                // 원금 자체에 delta 적용 (Capex가 늘어나면 동일 비율로 부채도 늘어난다고 가정)
                BigDecimal newPrincipal = t.getPrincipal().multiply(BigDecimal.valueOf(1 + delta));
                BigDecimal interest = newPrincipal.multiply(t.getInterestRate());
                int repayYears = t.getTenure() - t.getGracePeriod();
                BigDecimal principal = repayYears > 0
                    ? newPrincipal.divide(BigDecimal.valueOf(repayYears), 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
                return interest.add(principal);
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calcAnnualDS(List<PfTranche> tranches) {
        return tranches.stream()
            .filter(t -> !"EQUITY".equals(t.getSeniority()))
            .map(t -> {
                BigDecimal interest = t.getPrincipal().multiply(t.getInterestRate());
                int repayYears = t.getTenure() - t.getGracePeriod();
                BigDecimal principal = repayYears > 0
                    ? t.getPrincipal().divide(BigDecimal.valueOf(repayYears), 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
                return interest.add(principal);
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
