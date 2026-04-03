# 지능형 자동 헤징(Auto-Hedging) 및 전략 실행 사양서 (v1.0)

## 1. 개요 (Overview)
본 사양서는 IB 플랫폼의 **Phase 16: 지능형 자동 헤징** 시스템의 운영 프로토콜을 정의합니다. 실시간 리스크 점수를 기반으로 자산 가치 하락을 방어하기 위한 최적의 금융 파생상품을 추천하고, 임계점 초과 시 알고리즘에 의해 즉각적인 헤징을 실행하는 메커니즘을 다룹니다.

## 2. 헤징 대응 프로토콜 (Response Protocols)

시스템은 리스크 점수($Risk_{total}$)에 따라 세 단계의 대응 모드를 가집니다.

### 2.1 관찰 모드 (Observation Mode: $Risk < 60$)
- 통상적인 모니터링 상태.
- 별도의 헤징 추천을 생성하지 않음.

### 2.2 추천 모드 (Recommendation Mode: $60 \le Risk < 85$)
- **동작**: `AutoHedgingService`가 자산 유형별 맞춤형 헤징 전략을 생성하여 DB에 저장.
- **상태**: `RECOMMENDED` 상태로 저장되며, 사용자의 최종 승인(Execute 클릭) 대기.
- **추천 상품**:
    - `TECH/INFRA`: FX Swap (환리스크 방어)
    - `ENERGY/RENEWABLES`: Commodity Futures (원자재가 변동 방어)
    - `ALL`: Interest Rate Swap (IRS, 금리 변동 방어)

### 2.3 Sentinel Mode (Auto-Execution: $Risk \ge 85$)
- **동작**: 시스템이 위기 상황으로 판단하여 사용자의 개입 없이 즉시 헤징을 집행.
- **상태**: 즉시 `EXECUTED` 상태로 전환 및 실행 타임스탬프 기록.
- **목적**: 급격한 시장 변동성 발생 시 손실 최소화를 위한 완전 자동 방어 메커니즘.

## 3. 데이터 및 상태 관리 사양

### 3.1 전략 엔티티 (`T_IB_HEDGING_STRATEGY`)
- `expected_risk_reduction`: 해당 헤징 실행 시 예상되는 리스크 감소 수치.
- `confidence_score`: 알고리즘의 추천 신뢰도 (0.0 ~ 1.0).
- `status`: `RECOMMENDED` → `EXECUTED` 워크플로우.

## 4. UI/UX 연동 사양
- **Hedging Advisor Panel**: 글로벌 맵 우측 사이드바에 위치.
- **One-Click Execution**: 추천 리스트에서 'Execute' 클릭 시 실시간 API 호출 및 상태 반영.
- **Alert System**: Sentinel Mode 작동 시 대시보드 상단에 긴급 자동 헤징 알림 배너 노출.

---
**Last Updated**: 2026-04-03 | **Status**: Verified by Implementation
