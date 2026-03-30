---
ID: IB-DOC-U02
Title: 고급 투자자 수준 및 배정 티어 사양 / Advanced Investor Tiers & Allocation Specification
Category: UI/UX / Operation
Version: 1.2
Status: Formalized
---

# [IB-DOC-U02] 고급 투자자 수준 및 배정 티어 사양

본 사양서는 투자자의 성향과 과거 실적을 바탕으로 배정 우선순위를 결정하기 위한 **Tiering(계층화) 구조**를 정의합니다.

---

## 1. 투자자 티어 정의 (Investor Tiers)

| Tier | 명칭 (Name) | 주요 특징 | 배정 우선순위 |
|:---:|---|---|:---:|
| **T1** | **Anchor / Long-only** | 장기 보유 목적, 대규모 자금, 연기금 등 | **Highest** |
| **T2** | **Institutional** | 일반 운용사, 보험사, 은행 등 | **Normal** |
| **T3** | **Retail / Hedge** | 개인 투자자, 단기 차익 목적 헤지펀드 등 | **Adjusted** |

---

## 2. 배정 우대 및 제한 정책

- **Anchor Allocation**: 딜 전체 물량의 일정 비율(예: 30%)은 T1 투자자에게 우선 배정.
- **Long-only Boost**: 장기 보유 확약(Lock-up) 시 배정 가중치 추가 부여.
- **Flip Penalty**: 상장 후 즉각 매도(Flipping) 빈도가 높은 계좌에 대해 배정 물량 축소.

---

## 3. UI 시각화 (Tiered Dashboard)

- **Tier Distribution Chart**: 전체 청약 물량 중 티어별 비중을 파이 차트로 시각화.
- **Concentration Risk Alert**: 특정 티어 또는 특정 투자자 쏠림 발생 시 시각적 경고(Amber/Red) 표시.

---

> [!TIP]
> **실무 포인트**: 티어 분류는 매 딜 종료 후 사후 평가를 통해 자동 갱신(Dynamic Tiering)되는 구조를 지향합니다.
