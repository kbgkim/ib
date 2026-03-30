package com.ib.pf.service;

import com.ib.pf.dto.PfWaterfallResponse;
import com.ib.pf.model.PfCashFlow;
import com.ib.pf.model.PfTranche;
import com.ib.pf.repository.PfCashFlowRepository;
import com.ib.pf.repository.PfProjectRepository;
import com.ib.pf.repository.PfTrancheRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * PF Cash Flow Waterfall 분배 엔진
 *
 * 우선순위:
 *  1. OpEx (운영비용)
 *  2. Tax (세금)
 *  3. Senior Debt Service (원리금)
 *  4. DSRA Funding (예비비 6개월치)
 *  5. Mezzanine Debt Service
 *  6. Equity Distribution (주주 배당)
 */
@Service
public class PfWaterfallEngine {

    private static final BigDecimal DSRA_MONTHS = BigDecimal.valueOf(0.5); // 6개월치 DS

    private final PfProjectRepository projectRepo;
    private final PfCashFlowRepository cashFlowRepo;
    private final PfTrancheRepository trancheRepo;

    public PfWaterfallEngine(PfProjectRepository projectRepo,
                             PfCashFlowRepository cashFlowRepo,
                             PfTrancheRepository trancheRepo) {
        this.projectRepo = projectRepo;
        this.cashFlowRepo = cashFlowRepo;
        this.trancheRepo = trancheRepo;
    }

    public List<PfWaterfallResponse> runWaterfall(String projectId) {
        projectRepo.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        List<PfCashFlow> cashFlows = cashFlowRepo.findByProjectIdOrderByProjectYear(projectId);
        List<PfTranche> tranches = trancheRepo.findByProjectIdOrderBySeniority(projectId);

        // 트랜치별 분리
        List<PfTranche> seniorTranches = tranches.stream()
            .filter(t -> "SENIOR".equals(t.getSeniority()))
            .collect(Collectors.toList());
        List<PfTranche> mezzTranches = tranches.stream()
            .filter(t -> "MEZZANINE".equals(t.getSeniority()))
            .collect(Collectors.toList());

        BigDecimal annualSeniorDS = calcAnnualDS(seniorTranches);
        BigDecimal annualMezzDS = calcAnnualDS(mezzTranches);
        BigDecimal dsraTarget = annualSeniorDS.multiply(DSRA_MONTHS);

        List<PfWaterfallResponse> results = new ArrayList<>();

        for (PfCashFlow cf : cashFlows) {
            // 건설기간은 인출만 발생 — Waterfall 적용 제외
            if (cf.getCfads().compareTo(BigDecimal.ZERO) <= 0) {
                results.add(buildConstructionRow(cf));
                continue;
            }

            BigDecimal pool = cf.getRevenue();  // 총 수입 풀

            // 1. OpEx 지급
            BigDecimal opexPaid = min(pool, cf.getOpex());
            pool = pool.subtract(opexPaid);

            // 2. 세금 지급
            BigDecimal taxPaid = min(pool, cf.getTaxAmount());
            pool = pool.subtract(taxPaid);

            // 3. 선순위 부채 원리금
            BigDecimal seniorPaid = min(pool, annualSeniorDS);
            pool = pool.subtract(seniorPaid);

            // 4. DSRA 적립
            BigDecimal dsraFunded = min(pool, dsraTarget);
            pool = pool.subtract(dsraFunded);

            // 5. 메자닌 원리금
            BigDecimal mezzPaid = min(pool, annualMezzDS);
            pool = pool.subtract(mezzPaid);

            // 6. 주주 배당 (잔여 현금)
            BigDecimal equityDist = pool;
            BigDecimal residual = BigDecimal.ZERO;

            // DSCR 계산
            BigDecimal totalDS = seniorPaid.add(mezzPaid);
            BigDecimal dscr = totalDS.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.valueOf(99)
                : cf.getCfads().divide(totalDS.compareTo(BigDecimal.ZERO) == 0
                    ? annualSeniorDS.add(annualMezzDS) : annualSeniorDS.add(annualMezzDS), 4, RoundingMode.HALF_UP);

            results.add(PfWaterfallResponse.builder()
                .year(cf.getProjectYear())
                .grossRevenue(cf.getRevenue())
                .opexPaid(opexPaid)
                .taxPaid(taxPaid)
                .seniorDsPaid(seniorPaid)
                .dsraFunded(dsraFunded)
                .mezzPaid(mezzPaid)
                .equityDist(equityDist)
                .residual(residual)
                .dscr(dscr)
                .build());
        }
        return results;
    }

    private BigDecimal calcAnnualDS(List<PfTranche> tranches) {
        return tranches.stream()
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

    private BigDecimal min(BigDecimal a, BigDecimal b) {
        return a.compareTo(b) < 0 ? a : b;
    }

    private PfWaterfallResponse buildConstructionRow(PfCashFlow cf) {
        return PfWaterfallResponse.builder()
            .year(cf.getProjectYear())
            .grossRevenue(BigDecimal.ZERO)
            .opexPaid(BigDecimal.ZERO)
            .taxPaid(BigDecimal.ZERO)
            .seniorDsPaid(BigDecimal.ZERO)
            .dsraFunded(BigDecimal.ZERO)
            .mezzPaid(BigDecimal.ZERO)
            .equityDist(cf.getCapex().negate()) // 건설기간 인출은 음수 표기
            .residual(BigDecimal.ZERO)
            .dscr(BigDecimal.ZERO)
            .build();
    }
}
