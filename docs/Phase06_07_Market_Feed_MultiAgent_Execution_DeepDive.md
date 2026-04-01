# Phase 6-7: Market Feed & Multi-Agent (Aura) (Deep Dive)

## 1. 개요 (Overview)
본 문서는 실시간 시장 지표를 수집하고 이를 3명의 전문 AI 에이전트가 교차 검증하여 대응 전략을 도출 및 실행하는 **Aura Intelligence Framework**와 **Strategy Execution** 레이어의 기술 사양을 기록합니다.

## 2. 실시간 시장 지표 (Market Feed/Pulse)

### 2.1 마켓 티커 시뮬레이터 (Market Ticker)
- **컴포넌트**: `MarketDataService.java` (ib-mna-engine)
- **기술 상세**:
    - **10초 주기 스케줄러**: 유료 데이터 API를 대체하기 위해 10초마다 금리(UST 10Y), 환율, 유가, 탄소 배출권 가격 등을 변동(Random Walk) 시킴.
    - **통합 가치(WACC) 반영**: 변동된 시장 금리를 즉각적으로 전체 프로젝트의 WACC(가중평균자본비용)에 주입하여 실시간 NPV(순현재가치) 재산출.

## 3. 멀티 에이전트 지능형 어드바이저 (Aura Brain)

### 3.1 하이브리드 합의(Hybrid Consensus) 메커니즘
- **전문가 에이전트 그룹**:
    - **Quantara (Financial)**: 금리/수익성 리스크 분석.
    - **Lex (Legal)**: 계약 및 약정(Covenant) 위반 검토.
    - **Synergy (Operational)**: 공급망 및 CAPEX 오버런 위험 진단.
- **합의 로직**: 한 에이전트의 판단(예: 금리 급등으로 인한 수익성 악화)이 다른 분야(예: 법무적 리파이낸싱 필요성)에 미치는 도미노 효과를 교차 분석하여 최종 전략 요약 도출.

## 4. 약정 감시 및 전략 실행 (Execution Loop)

### 4.1 실시간 약정 감시 (Covenant Breach Monitor)
- **임계치 설정**: 최소 DSCR `1.15x` 또는 UST 10Y `4.65%` 초과 시 즉각적으로 시스템 `BREACH` 상태 발동.
- **시각화**: `MarketTicker` UI에 네온 레드 펄스(Neon Pulse) 효과를 적용하여 사용자에게 긴급 상황 전파.

### 4.2 전략 즉시 실행 (One-Click Strategy Injection)
- **로직**: AI 에이전트가 제안한 대응 전략(예: Equity Injection, Re-financing)을 [Apply Strategy] 버튼 클릭 한 번으로 재무 모델 파라미터에 즉시 오버라이드.
- **효과**: 전략 실행 후 회복된 NPV와 완화된 리스크 점수를 실시간으로 대시보드에 시각화하여 의사결정 시뮬레이션 지원.

## 5. UI 구성 요소 (Intelligence Panel)
- **Advisor Panel**: 3명의 전문가 에이전트 카드와 전략 실행 버튼이 통합된 지능형 인터페이스 (React).
- **Sticky Market Bar**: 대시보드 상단에 위치하여 어떠한 화면에서도 실시간 시장 상황을 관찰 가능.
