package com.ib.pf.service;

import com.ib.pf.dto.PfMetricsResponse;
import com.ib.pf.model.PfCashFlow;
import com.ib.pf.model.PfProject;
import com.ib.pf.model.PfTranche;
import com.ib.pf.repository.PfCashFlowRepository;
import com.ib.pf.repository.PfProjectRepository;
import com.ib.pf.repository.PfTrancheRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

/**
 * PF 핵심 재무 지표 계산 엔진
 *
 * DSCR  = CFADS / Annual Debt Service
 * LLCR  = PV(CFADS over loan life) / Outstanding Debt
 * PLCR  = PV(CFADS over project life) / Outstanding Debt
 */
@Service
public class PfMetricsEngine {

    private final PfProjectRepository projectRepo;
    private final PfCashFlowRepository cashFlowRepo;
    private final PfTrancheRepository trancheRepo;

    public PfMetricsEngine(PfProjectRepository projectRepo,
                           PfCashFlowRepository cashFlowRepo,
                           PfTrancheRepository trancheRepo) {
        this.projectRepo = projectRepo;
        this.cashFlowRepo = cashFlowRepo;
        this.trancheRepo = trancheRepo;
    }

    public PfMetricsResponse calculate(String projectId) {
        PfProject project = projectRepo.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        List<PfCashFlow> cashFlows = cashFlowRepo.findByProjectIdOrderByProjectYear(projectId);
        List<PfTranche> tranches = trancheRepo.findByProjectIdOrderBySeniority(projectId);

        // 운영기간 현금흐름만 필터링
        List<PfCashFlow> operationalCFs = cashFlows.stream()
            .filter(cf -> cf.getCfads().compareTo(BigDecimal.ZERO) > 0)
            .collect(Collectors.toList());

        // DSCR & Metrics Calculation (Phase 5: Dynamic year-by-year analysis)
        BigDecimal totalMinDscr = BigDecimal.valueOf(999);
        BigDecimal totalDscrSum = BigDecimal.ZERO;
        BigDecimal annualDebtSum = BigDecimal.ZERO;

        for (PfCashFlow cf : operationalCFs) {
            BigDecimal adsForYear = calculateAnnualDebtService(tranches, project, cf.getProjectYear());
            BigDecimal dscrForYear = adsForYear.compareTo(BigDecimal.ZERO) == 0 
                ? BigDecimal.valueOf(999) 
                : cf.getCfads().divide(adsForYear, 4, RoundingMode.HALF_UP);
            
            if (dscrForYear.compareTo(totalMinDscr) < 0) totalMinDscr = dscrForYear;
            totalDscrSum = totalDscrSum.add(dscrForYear);
            annualDebtSum = annualDebtSum.add(adsForYear);
        }

        BigDecimal minDscr = operationalCFs.isEmpty() ? BigDecimal.ZERO : totalMinDscr;
        BigDecimal avgDscr = operationalCFs.isEmpty() ? BigDecimal.ZERO :
            totalDscrSum.divide(BigDecimal.valueOf(operationalCFs.size()), 4, RoundingMode.HALF_UP);
        
        BigDecimal annualDebtService = operationalCFs.isEmpty() ? BigDecimal.ZERO :
            annualDebtSum.divide(BigDecimal.valueOf(operationalCFs.size()), 4, RoundingMode.HALF_UP);

        // LLCR — 대출 기간 CFADS의 PV / 총 부채 원금
        BigDecimal totalDebt = tranches.stream()
            .filter(t -> !t.getSeniority().equals("EQUITY"))
            .map(PfTranche::getPrincipal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        double discountRate = project.getDiscountRate().doubleValue();
        int loanTenure = project.getLoanTenure();

        double pvCfadsLoan = 0;
        double pvCfadsProject = 0;
        int opYear = 0;

        for (PfCashFlow cf : operationalCFs) {
            opYear++;
            double cfads = cf.getCfads().doubleValue();
            pvCfadsLoan += (opYear <= loanTenure) ? cfads / Math.pow(1 + discountRate, opYear) : 0;
            pvCfadsProject += cfads / Math.pow(1 + discountRate, opYear);
        }

        BigDecimal llcr = totalDebt.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO :
            BigDecimal.valueOf(pvCfadsLoan).divide(totalDebt, 4, RoundingMode.HALF_UP);

        BigDecimal plcr = totalDebt.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO :
            BigDecimal.valueOf(pvCfadsProject).divide(totalDebt, 4, RoundingMode.HALF_UP);

        // 등급 판정
        String dscrGrade = gradeMetric(minDscr.doubleValue(), 1.30, 1.20, 1.10);
        String llcrGrade = gradeMetric(llcr.doubleValue(), 1.50, 1.30, 1.10);
        String plcrGrade = gradeMetric(plcr.doubleValue(), 1.80, 1.50, 1.20);

        return PfMetricsResponse.builder()
            .projectId(projectId)
            .projectName(project.getProjectName())
            .minDscr(minDscr.setScale(4, RoundingMode.HALF_UP))
            .avgDscr(avgDscr.setScale(4, RoundingMode.HALF_UP))
            .llcr(llcr.setScale(4, RoundingMode.HALF_UP))
            .plcr(plcr.setScale(4, RoundingMode.HALF_UP))
            .annualDebtService(annualDebtService.setScale(2, RoundingMode.HALF_UP))
            .totalDebt(totalDebt)
            .dscrGrade(dscrGrade)
            .llcrGrade(llcrGrade)
            .plcrGrade(plcrGrade)
            .operationalYears(operationalCFs.size())
            .build();
    }

    /**
     * 트랜치별 부채서비스 합산 (Phase 5: Dynamic Interest Rate & Inflation 지원)
     */
    private BigDecimal calculateAnnualDebtService(List<PfTranche> tranches, PfProject project, int year) {
        return tranches.stream()
            .filter(t -> !t.getSeniority().equals("EQUITY"))
            .map(t -> {
                // Yield Curve 반영 (Mock: BaseRate + Spread)
                BigDecimal baseRate = "INVERTED".equals(project.getYieldCurveId()) 
                    ? BigDecimal.valueOf(0.06 - (year * 0.002)) // Inverted: Rate decreases over time
                    : BigDecimal.valueOf(0.04 + (year * 0.003)); // Steep: Rate increases over time
                
                BigDecimal dynamicRate = baseRate.add(BigDecimal.valueOf(0.015)); // 1.5% fixed spread
                
                // 이자 = 원금 × 동적 금리
                BigDecimal annualInterest = t.getPrincipal().multiply(dynamicRate);
                
                // 원금 상환 (상환기간 내에서)
                BigDecimal annualPrincipal = BigDecimal.ZERO;
                if (year > t.getGracePeriod() && year <= t.getTenure()) {
                    annualPrincipal = t.getPrincipal()
                        .divide(BigDecimal.valueOf(t.getTenure() - t.getGracePeriod()), 4, RoundingMode.HALF_UP);
                }
                
                return annualInterest.add(annualPrincipal);
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String gradeMetric(double value, double green, double yellow, double red) {
        if (value >= green) return "SAFE";
        if (value >= yellow) return "WARNING";
        if (value >= red) return "CAUTION";
        return "BREACH";
    }
}
