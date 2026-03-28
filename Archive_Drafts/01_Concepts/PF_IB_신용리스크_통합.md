# PF & IB 신용리스크 통합 개념 정리

---

## 1. 신용리스크 기본 개념

신용리스크는 채무자가 **약속된 지급을 이행하지 못할 가능성**과 그로 인한 **손실**을 의미합니다.

| 항목 | 의미 | 계산/활용 |
|------|------|------------|
| **PD (Probability of Default)** | 일정 기간 내 채무자가 부도날 확률 | 기업 신용도, 프로젝트 위험 분석, CDS 스프레드 산정 |
| **LGD (Loss Given Default)** | 부도 발생 시 손실 비율 | 담보, 회수 가능성, 트랜치 구조 반영 |
| **EAD (Exposure at Default)** | 부도 시점에서 노출 금액 | 대출 잔액, 미사용 신용공여 포함 |
| **EL (Expected Loss)** | 평균 예상 손실 | EL = PD × LGD × EAD → PF/IB 가격·스프레드·투자 구조 설계 |
| **UL (Unexpected Loss)** | EL을 초과할 수 있는 극단적 손실 | 극단 시나리오 대비 자본, PF 트랜치 설계, VaR 산정 |

---

## 2. PF(Project Finance) 관점

- PF는 **프로젝트 자체 현금흐름 기반**으로 신용리스크 평가
- **트랜치 구조**로 위험 분리: Senior, Mezzanine, Equity

| 구성 | PD | LGD | EAD | EL | UL |
|------|----|----|-----|----|----|
| Senior Debt | 낮음 | 낮음 | 투입 자금 | 낮음 | 낮음 |
| Mezzanine Debt | 중간 | 중간 | 투입 자금 | 중간 | 중간 |
| Equity | 높음 | 높음 | 투자금 | 높음 | 높음 |

- **특징**
  - Non-Recourse 구조 → Sponsor 신용보다 프로젝트 자체 위험 중심
  - SPV 운영 → Cash Flow 기반 배분
  - UL은 스트레스 시나리오(건설 지연, Offtaker 부도 등)에 대응

---

## 3. IB(Investment Banking) 관점

### 3-1. DCM (채권 발행)

- 기업 신용도 기반 PD/LGD/EAD 평가
- EL → 스프레드 및 금리 산정
- UL → VaR/Capital 산정, 내부 자본 관리

### 3-2. ECM (주식 발행)

- EL/UL 직접 계산보다는 **기업 재무건전성, 투자자 수요** 중심
- Extreme Loss 상황은 IR/시장 수요 감소 정도로 고려

---

## 4. 신용리스크 흐름 통합 시각화

     ┌─────────────┐
     │ Exposure    │
     │ at Default  │  ← 대출/투자/발행 규모 → EAD
     └─────┬───────┘
           │
           ▼
    ┌─────────────┐
    │ Probability │
    │ of Default  │  ← 기업/프로젝트 신용도, SPV Cash Flow → PD
    └─────┬───────┘
           │
           ▼
    ┌─────────────┐
    │ Loss Given  │
    │ Default     │  ← 담보, 회수율, 트랜치 구조 → LGD
    └─────┬───────┘
           │
           ▼
    ┌─────────────┐
    │ Expected    │
    │ Loss (EL)  │  ← EL = PD × LGD × EAD
    └─────┬───────┘
           │
           ▼
    ┌─────────────┐
    │ Unexpected │
    │ Loss (UL)  │  ← EL 초과 극단 손실, VaR, 자본 산정
    └─────┬───────┘
           │
           ▼
    ┌─────────────┐
    │ 트랜치/투자자│
    │ 배분/스프레드│
    └─────────────┘

- PF: 트랜치별 EL/UL 차등 적용, SPV Cash Flow 기반  
- DCM: EL → 스프레드, UL → VaR/Capital  
- ECM: UL 거의 직접 활용 안 됨, 대신 투자자 수요/시장 변동성 반영

---

## 5. 핵심 요약

1. **신용리스크 확장 구조**: PD → LGD → EAD → EL → UL  
2. **PF vs IB 차이**
   - PF: 트랜치 구조 + 프로젝트 Cash Flow 중심, UL 활용 필수
   - DCM: 기업 신용 기반, EL → 스프레드, UL → VaR/Capital
   - ECM: EL/UL 직접 활용 적음, 재무 건전성/수요 중심
3. **실무 활용**
   - PF: 트랜치 설계, DSCR, LLCR, 투자자 배분
   - IB: DCM → 금리/스프레드/등급, ECM → 공모가·수요 확인
4. **통합 관점**: 모든 신용리스크는 **예상 손실(EL)**과 **극단 손실(UL)** 관점에서 관리, 투자자/채권자 배분과 연결
