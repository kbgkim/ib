# PF Cash Flow Model (Project Finance) – 실무형 엑셀 설계 문서

---

# 1. 모델 개요

## 목적
- PF 프로젝트의 **현금흐름 기반 상환 가능성 분석**
- 금융기관 투자 의사결정 지원

## 핵심 산출물
- DSCR (Debt Service Coverage Ratio)
- IRR (Internal Rate of Return)
- Cash Flow Waterfall
- Loan Balance Schedule

---

# 2. 엑셀 시트 구성 (실무 표준)

| Sheet명 | 역할 |
|--------|------|
| Assumption | 입력값 |
| Construction | 공사 단계 CF |
| Operation | 분양/운영 CF |
| Financing | 대출 구조 |
| Waterfall | 상환 구조 |
| Output | 결과 |

---

# 3. Assumption 시트 (입력값)

## 기본 가정

| 항목 | 값 |
|------|----|
| 총 사업비 | 1,000억 |
| 분양가 | 5억/세대 |
| 세대수 | 300 |
| 공사기간 | 24개월 |
| 분양기간 | 18개월 |
| 금리 | 7% |

---

## 분양 가정

| 월 | 분양률 (%) |
|----|-----------|
| 1 | 5% |
| 2 | 10% |
| ... | ... |

👉 누적 분양률 기반 매출 발생

---

# 4. Construction 시트 (공사 단계)

## 공사비 집행 구조

| 월 | 공정률 | 공사비 |
|----|--------|--------|
| 1 | 2% | 20억 |
| 2 | 5% | 50억 |
| ... | ... | ... |

---

## 공식


공사비 = 총 공사비 × 월별 공정률


---

# 5. Operation 시트 (분양 수익)

## 매출 계산


분양 매출 = 세대수 × 분양가 × 월별 분양률


---

## 현금 유입 구조


계약금 → 중도금 → 잔금


---

## 예시

| 구분 | 비율 |
|------|------|
| 계약금 | 10% |
| 중도금 | 60% |
| 잔금 | 30% |

---

# 6. Financing 시트 (대출 구조)

## Loan Drawdown


필요 자금 = 총 비용 - Equity


---

## 이자 계산


이자 = 대출잔액 × 금리 / 12


---

## Loan Balance


기말잔액 = 기초잔액 + 신규대출 - 상환


---

# 7. Waterfall 시트 (핵심)

## 현금 흐름 우선순위


매출 → 운영비 → 이자 → 원금 → Mezz → Equity


---

## 구조

| 단계 | 항목 |
|------|------|
| 1 | OPEX |
| 2 | Interest |
| 3 | Principal |
| 4 | Mezz |
| 5 | Equity |

---

## Cash Sweep

- 잔여 현금 자동 상환

---

# 8. DSCR 계산

## 공식


DSCR = Net Cash Flow / Debt Service


---

## 구성

- Net Cash Flow = 매출 - 비용
- Debt Service = 이자 + 원금

---

## 해석

| 값 | 의미 |
|----|------|
| > 1.2 | 안정 |
| 1.0~1.2 | 위험 |
| < 1.0 | 부도 가능 |

---

# 9. IRR 계산

## Equity IRR


IRR = 투자 대비 수익률


---

## 엑셀 함수


=IRR(현금흐름 범위)


---

# 10. Output 시트

## 주요 결과

| 항목 | 값 |
|------|----|
| Project IRR | XX% |
| Equity IRR | XX% |
| Min DSCR | X.X |
| Peak Loan | XXX억 |

---

# 11. 실무 핵심 포인트

## ① 모델의 본질

👉 “미래 현금흐름 시뮬레이션 엔진”

---

## ② 금융사가 보는 것

- 최저 DSCR
- 분양 속도
- 공정률 vs 자금집행
- 금리 민감도

---

## ③ 반드시 구현해야 할 것

- Scenario 분석 (Best / Base / Worst)
- 금리 상승 시뮬레이션
- 분양 지연 시뮬레이션

---

# 12. 고급 확장 (실무 레벨)

## Sensitivity Analysis

| 변수 | 영향 |
|------|------|
| 분양률 | 매우 큼 |
| 금리 | 큼 |
| 공사비 | 중간 |

---

## Monte Carlo (선택)

- 분양률 랜덤 시뮬레이션

---

# 13. 개발자 관점 구조

## 테이블 설계

### PROJECT
- project_id
- total_cost
- duration

### CASH_FLOW
- period
- inflow
- outflow

### LOAN
- balance
- interest
- principal

---

## 핵심 로직


for t in 기간:
inflow 계산
outflow 계산
이자 계산
상환 계산
잔액 업데이트


---

# 14. 한 줄 정리

👉 PF Cash Flow 모델은  
**“프로젝트의 생존 가능성을 계산하는 금융 시뮬레이션 엔진”**

---