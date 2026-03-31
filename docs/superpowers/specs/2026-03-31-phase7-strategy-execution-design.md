# Phase 7 Design Spec: Intelligent Risk Mitigation & Strategy Execution (v1.0)

**작성일**: 2026-03-31 | **현상태**: Phase 7 설계 확정 (Brainstorming Complete)

## 1. 개요 (Overview)

Phase 7은 IB 플랫폼의 최종 고도화 단계인 **"폐쇄 루프형 리스크 관리(Closed-Loop Risk Management)"**를 지향합니다. 이전 단계에서 구축한 실시간 데이터와 전문가 에이전트 기능을 결합하여, 리스크 감지(Covenant Monitoring)부터 해결책 제시(Advisor), 그리고 실제 모델 반영(Apply to Scenario)까지 하나의 흐름으로 연결합니다.

## 2. 핵심 기능 정의 (Core Features)

### 2.1 Covenant Smart Monitor (약정 자동 감시 엔진)
*   **목적**: 금융 약정(Covenant) 위반 여부를 실시간으로 감시하고 선제적 경고를 제공합니다.
*   **작동 원리**:
    *   `MarketDataService`의 실시간 금리/환율 데이터를 기반으로 `ValuationService`가 매 10초마다 핵심 지표(DSCR, LLCR 등)를 재산출합니다.
    *   산출된 지표가 설정된 임계치(예: DSCR < 1.15x) 이하로 떨어지면 시스템 전체에 `BREACH_WARNING` 이벤트를 발생시킵니다.
*   **UI 표현**: 대시보드 상단에 긴급 경고 배너 및 상태 인디케이터 표시.

### 2.2 Advisor Action-Link: "Apply to Scenario" (원클릭 전략 실행)
*   **목적**: 전문가 에이전트의 정성적 조언을 정량적 수치로 즉각 변환하여 결과를 시뮬레이션합니다.
*   **작동 원리**:
    *   AI 에이전트가 조언을 생성할 때, 기계가 읽을 수 있는 **Action Tag** (예: `ACTION_REFINANCE_4.5`)를 함께 생성합니다.
    *   사용자가 조언 카드 옆의 **[전략 실행]** 버튼을 클릭하면, 해당 태그에 매핑된 파라미터가 현재 시나리오 엔진에 주입됩니다.
    *   주입 직후 차트가 리로드되어 리스크가 완화(Mitigate)된 결과를 즉시 시연합니다.

---

## 3. 기술 아키텍처 및 데이터 흐름 (Data Flow)

1.  **Sensing**: `MarketFeed` 변동 감지 -> `CovenantMonitor` 가 위반 여부 판별.
2.  **Advising**: 위반 감지 시 `Multi-Agent Advisor`가 대응 전략 수립 및 **Actionable Tag** 생성.
3.  **Acting**: 사용자가 UI에서 `Apply Mitigation` 클릭.
4.  **Simulating**: `ib-mna-engine`이 파라미터 업데이트 -> `ValuationWaterfall` 결과 갱신.
5.  **Closing the Loop**: 리스크 점수 및 밸류에이션 회복 확인.

## 4. UI/UX 요구사항 (UI/UX Requirements)

*   **Advisor Panel**: 전문가 조언 하단에 세련된 네온 블루 스타일의 `[Apply Strategy]` 버튼 배치.
*   **Visual Feedback**: 전략 적용 시 "전략이 모델에 반영되었습니다"라는 토스트 알림과 함께 차트 애니메이션 효과 적용.
*   **Comparison View**: 전략 적용 전/후의 가치 변화를 한눈에 볼 수 있는 요약 카드 제공.

---

## 5. 성공 기준 (Success Criteria)

1.  시장 데이터 변동에 따라 10초 이내에 약정 위반 경고가 발생함.
2.  전문가 조언의 '실행' 버튼 클릭 시, 수동 입력 없이 백엔드 모델의 특정 변수(금리 등)가 변경됨.
3.  전략 적용 후 밸류에이션(NPV)이 회복되는 과정을 사용자가 육안으로 확인 가능함.
