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
import java.math.MathContext;
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

        // 운영기간 현금흐름만 필터링 (건설기간 제외, CFADS > 0인 연도)
        List<PfCashFlow> operationalCFs = cashFlows.stream()
            .filter(cf -> cf.getCfads().compareTo(BigDecimal.ZERO) > 0)
            .collect(Collectors.toList());

        // 연간 부채서비스 계산 (선순위 + 메자닌 원리금)
        BigDecimal annualDebtService = calculateAnnualDebtService(tranches);

        // DSCR — 운영 연도 중 최소 DSCR (최악 시나리오 기준)
        BigDecimal minDscr = operationalCFs.stream()
            .map(cf -> annualDebtService.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.valueOf(999)
                : cf.getCfads().divide(annualDebtService, 4, RoundingMode.HALF_UP))
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        // 평균 DSCR
        BigDecimal avgDscr = operationalCFs.isEmpty() ? BigDecimal.ZERO :
            operationalCFs.stream()
                .map(cf -> annualDebtService.compareTo(BigDecimal.ZERO) == 0
                    ? BigDecimal.valueOf(999)
                    : cf.getCfads().divide(annualDebtService, 4, RoundingMode.HALF_UP))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(operationalCFs.size()), 4, RoundingMode.HALF_UP);

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
     * 트랜치별 연간 원리금 합산 (원금균등 방식 기준)
     * 거치기간(gracePeriod) 이후 상환 시작
     */
    private BigDecimal calculateAnnualDebtService(List<PfTranche> tranches) {
        return tranches.stream()
            .filter(t -> !t.getSeniority().equals("EQUITY"))
            .map(t -> {
                // 이자 = 원금 × 금리
                BigDecimal annualInterest = t.getPrincipal().multiply(t.getInterestRate());
                // 원금 = 원금 / 상환기간
                BigDecimal annualPrincipal = t.getPrincipal()
                    .divide(BigDecimal.valueOf(t.getTenure() - t.getGracePeriod()), 4, RoundingMode.HALF_UP);
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
