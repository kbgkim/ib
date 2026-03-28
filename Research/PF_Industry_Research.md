# [Research] PF (Project Finance) 산업 연구 및 모범 사례 (Korean/English Mix)

이 문서는 Project Finance (PF) 및 재무 모델링의 글로벌 표준과 분석 기법을 국문/영문 혼용 방식으로 정리하여, `Formal_Specs(정규 사양서)`의 상위 연구 데이터로 활용됩니다.

---

## 1. PF 생애주기 (Project Finance Lifecycle)

PF 금융 모델(Financial Model)은 각 단계(Stage)별로 서로 다른 목적과 고도화 수준을 요구합니다.

| 단계 (Phase) | 설명 (Description) | 금융 모델의 역할 (Financial Model Role) |
|---|---|---|
| **1. 사업 개발 (Development)** | 사업성 검토(Feasibility), 인허가, EPC/O&M 계약 협상 | 자금 조달 가능성(Bankability) 및 초기 ROI 분석 |
| **2. 구조화 (Structuring)** | 대주단(Lenders) 리스크 평가 및 대출 규모 산정 | 최적의 타리프(Tariff) 도출 또는 DSCR 기반 차입 규모 결정 |
| **3. 금융 약정 (Financial Close)** | 모든 법률/학술 계약 체결 및 한도 설정 | 모델을 기준(Baseline)으로 동결; 상환 스케줄 확정 |
| **4. 건설 기간 (Construction)** | 자산 건설 및 월별 자금 인출(Drawdown) | 유동성 관리, 건설 중 이자(IDC) 및 공정률 트래킹 |
| **5. 운영 기간 (Operational)** | 매출 발생 및 현금흐름 Waterfall 기반 상환 | 현금 관리, 부채 상환(Debt Service) 및 배당(Dividend) |

---

## 2. 표준 재무 지표 (Standard Financial Metrics)

### 대주단 관점 (Lender-Focused: Debt Service)
- **DSCR (Debt Service Coverage Ratio): 원리금 상환 유예 비율**
    - `CFADS / (원금 + 이자)`
    - 당기 현금흐름으로 원리금을 얼마나 갚을 수 있는지 측정 (기준: 보통 `> 1.20x`)
- **LLCR (Loan Life Coverage Ratio): 대출 전 기간 상환 비율**
    - `PV(대출 기간 CFADS) / 대출 잔액`
    - 대출 만기까지의 총 현금을 현재가치로 환산하여 부채 상환 능력을 측정
- **PLCR (Project Life Coverage Ratio): 프로젝트 전 기간 상환 비율**
    - `PV(전 기간 CFADS) / 대출 잔액`
    - 프로젝트 종료 시점까지의 총 현금 유입 능력을 측정하여 리스크 완충력 평가

### 투자자 관점 (Investor-Focused: Returns)
- **Project IRR (Internal Rate of Return)**: 레버리지 이전의 프로젝트 수익률 (자체 수익성)
- **Equity IRR**: 대출 상환 후 주주에게 귀속되는 수익률 (실질 투자 수익률)
- **Money Multiple**: `총 배담금 / 총 투자 원금`

---

## 3. 현금흐름 Waterfall 구조 (Cash Flow Waterfall Hierarchy)

PF는 **SPV (Special Purpose Vehicle)**의 현금 흐름을 법적/계약적으로 강제하는 엄격한 우선순위 체계를 가집니다.

1.  **프로젝트 매출 (Project Revenues)**: 총 현금 유입
2.  **운영 비용 (OpEx: Operating Expenses)**: 공장 가동 및 유지보수 비용 (최우선순위)
3.  **세금 (Taxes)**: 법인세 및 제세공과금
4.  **선순위 부채 상환 (Senior Debt Service)**: 선순위 대출 이자 및 원금
5.  **예비비 적립 (Reserve Funding - DSRA)**: 미래를 위한 상환 준비금 적립
6.  **후순위 부채 (Junior/Sub Debt)**: 후순위 이자 및 원리금
7.  **배당 (Equity Distributions - Dividends)**: 주주 배당 (가장 마지막에 지급)

---

## 4. 모델링 모범 사례 (Modeling Best Practices)

- **Scenario vs. Sensitivity (시나리오 vs. 민감도)**:
    - *민감도(Sensitivity)*: 한 가지 변수만 변경 (ex: 건설비 10% 상승)
    - *시나리오(Scenario)*: 여러 변수를 복합적으로 변경하여 '스토리' 구성 (ex: 고물가 + 매출 저조 'Worst Case')
- **투명성 확보**: 입력값(Input)은 파란색, 계산식(Calculation)은 검은색으로 구분하여 하드코딩 지양.
- **시각화**: 민감도 분석은 Tornado 차트로, 현금 흐름은 Waterfall 차트로 표현.
