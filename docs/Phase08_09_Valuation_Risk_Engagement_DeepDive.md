# Phase 8-9: Valuation Bridge & Risk Engagement (Deep Dive)

## 1. 개요 (Overview)
본 문서는 시나리오 가중치와 가치 변동의 정밀도를 강화한 **Phase 8: Valuation Bridge**와 분석 결과에 따른 실시간 사용자 피드백인 **Phase 9: Risk Engagement**의 기술 사양을 기록합니다.

## 2. 밸류에이션 브릿지 정밀화 (Valuation Bridge - Phase 8)

### 2.1 시나리오 가중치 연산
- **목적**: `BEAR`, `BASE`, `BULL` 시나리오별로 상이하게 산출된 가치 데이터(현금흐름, 시너지 등)를 사용자가 정의한 가중치(`weights.bear`, `weights.base`, `weights.bull`)로 가중 평균하여 최종 포트폴리오 가치를 도출.
- **구현 상세 (`ValuationService.java`)**: 
    - `BEAR*(w/100) + BASE*(w/100) + BULL*(w/100)` 산식을 각 항목(Base Value, Cost Synergy, Revenue Synergy)에 개별 적용.
    - 리스크 소생(`isMitigated`) 상태가 `true`일 경우, 최종 NPV에 추가 보정치(예: +8.0%)를 동적으로 연산하여 브릿지 결과에 반영.

## 3. 실시간 리스크 엔게이징 (Risk Engagement - Phase 9)

### 3.1 분석 완료 알림 트리거
- **컴포넌트**: `App.jsx`
- **구현 방식**: 
    - `handleRiskResult` 함수 내부에 리스크 분석 결과가 수신되는 즉시 알림 객체(`newNotif`)를 생성하도록 로직 추가.
    - 분석된 최종 등급(Grade)과 리스크 점수 데이터를 사용자에게 즉각 노출하여 신속한 인지 지원.

### 3.2 리스크 소생 필터 연동
- 사용자가 조언 패널의 대응 전략을 수용할 시, 전체 밸류에이션 차트와 레이더 차트가 실시간으로 재렌더링되며 리스크 완화 시나리오를 즉각 투영하도록 설계.

## 4. UI/UX 구현 (Engagement Feedback)
- 분석 완료 후 등급 배지(`GradeBadge`)와 알림 데스크톱 토스트(`Toast`)를 연동하여 '살아있는 대시보드' 경험 구현.
