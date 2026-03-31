# Phase 6 Design Spec: Integrated Multi-Agent Advisor & Market Feed (v1.0)

**작성일**: 2026-03-31 | **현상태**: 설계 확정 (Brainstorming Complete)

## 1. 개요 (Overview)

Phase 6는 IB 플랫폼의 "지능형 시뮬레이션" 단계를 완성하는 목표를 가집니다. 실시간으로 변동하는 국제 시장 데이터(Market Feed)를 수집하고, 이를 바탕으로 법률, 재무, 운영 각 분야의 전문 AI 에이전트들이 교차 검증(Cross-Verification)을 수행하여 사용자에게 고도화된 전략적 조언을 제공합니다.

## 2. 디자인 원칙 (Design Principles)

1.  **Intelligence-Led Hybrid**: 데이터 수집 자체보다, 데이터가 리스크에 미치는 '영향'을 해석하는 AI 에이전트에 집중합니다.
2.  **Hybrid Structured Consensus**: 에이전트들은 독립적으로 분석하되, 서로의 결론에 대해 코멘트를 달아 리스크 도미노 현상을 포착합니다.
3.  **Premium Real-time Aura**: 대시보드 상단에 위치한 Ticker와 Advisor 패널은 시각적으로 "살아있는 플랫폼"의 느낌을 주어야 합니다.

---

## 3. 핵심 구성 요소 (Core Components)

### 3.1 Market Feed Integration (The Pulse)
실시간 금융 데이터를 수집하고 시나리오 엔진(M&A, PF)에 주입하는 레이어입니다.

*   **수집 지표 (Default Suite)**:
    *   **이자율**: 국고채 3년(KR), 美 국채 10년(US), **신용 스프레드(AA~BBB)**
    *   **환율**: USD/KRW, JPY/KRW
    *   **ESG/원자재**: **탄소 배출권 가격(ETS)**, WTI 유가, 핵심 원자재(구리/리튬 등)
*   **구현**: `ib-mna-engine` 내 `MarketFeedProvider` 인터페이스를 통해 Mock 시뮬레이터 또는 실제 API 연동 가능 구조로 구현.

### 3.2 Multi-Agent Advisor (The Brain)
`ib-ml-engine` (Python) 기반으로 구축되는 고도화된 리스크 분석 전문가 그룹입니다.

*   **에이전트 페르소나**:
    *   **Coordinator**: 전체 브리핑 요약 및 상충 의견 조율.
    *   **Lex (Legal)**: 규제 변화, 약정(Covenant) 위반, 탄소 중립 법규 중심 리스크 분석.
    *   **Quantara (Financial)**: 금리/환율 변동에 따른 WACC, NPV, DSCR 민감도 분석.
    *   **Synergy (Operational)**: 공급망 병목, 원자재가 상승에 따른 CAPEX 초과 및 실행 리스크 분석.
*   **협업 메커니즘**:
    *   **Parallel Analysis**: 모든 전문가가 동시에 프로젝트 데이터 + Market 데이터 분석.
    *   **Cross-Commentary**: Lex의 의견(예: 규제 지연)이 Quantara의 수치(예: 수익성 하락)에 미치는 영향을 서로 참조.
    *   **Unified Conclusion**: 최종적으로 "하이브리드 합의안"을 도출하여 카드 형태로 UI에 전달.

---

## 4. 데이터 흐름 (Data Flow)

1.  **Market Feed** -> `MarketDataBuffer` (10s interval updates)
2.  **User Project Data** + **Market Data** -> `ib-ml-engine` (FastAPI)
3.  **ML Engine** -> `Multi-Agent Workflow` (Coordinator -> Lex/Quantara/Synergy -> Summary)
4.  **Results** -> `ib-mna-engine` -> `ib-ui-web` (WebSocket/Polling)
5.  **UI Display**: Top Ticker (Pulse) + Right Panel Advisor Cards (Brain)

---

## 5. UI/UX 요구사항 (UI/UX Requirements)

*   **Ticker**: 다크 모드 배경에 네온 컬러(Green/Red) 폰트를 사용하여 실시간 변동성 시각화.
*   **Advisor Cards**: 각 에이전트의 Avatar와 함께 "최근 대화 내용" 형식의 버블 인터페이스 사용.
*   **Health Gauge**: Market 변동에 따라 실시간으로 바늘이 움직이는 게이지 차트 적용.

---

## 6. 성공 기준 (Success Criteria)

1.  금리/환율 데이터를 10초 간격으로 동적으로 수집 및 표시 가능.
2.  에이전트들이 서로의 의견을 참조하여 "복합적 리스크"를 최소 2개 이상 식별 가능.
3.  사용자가 특정 시나리오를 선택할 때 에이전트들의 의견이 즉각적으로 갱신됨.
