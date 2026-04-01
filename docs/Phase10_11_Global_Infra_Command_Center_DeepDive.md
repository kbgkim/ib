# Phase 10-11: Global Infra & Command Center (Deep Dive)

## 1. 개요 (Overview)
본 문서는 플랫폼 전반의 다국어 지원 및 알림 체계를 구축한 **Phase 10: Global Infrastructure**와 전체 자산 현황을 통합 관제하는 **Phase 11: Portfolio Command Center**의 구현 상세를 기록합니다.

## 2. 글로벌 인프라 및 알림 체계 (Global Infra - Phase 10)

### 2.1 다국어 지원 (i18n) 시스템
- **컴포넌트**: `src/utils/translations.js`
- **구현 로직**: 
    - `ko`(한국어)와 `en`(영어) 객체를 가진 대규모 번역 사전을 구축.
    - `App.jsx`에서 `lang` 상태를 관리하며, `t(key)` 헬퍼 함수를 통해 실시간 언어 전환 지원.
- **UI 연동**: 사이드바 하단의 `lang-toggle` 버튼을 통해 대시보드 전체의 라벨, 버튼, 차트 범례 등을 즉각 재렌더링.

### 2.2 알림 센터 (Notification Center)
- **상태 관리**: `notifications` 배열을 전역 상태로 유지하여 실시간 분석 결과, 리벨런싱 완료 등을 저장.
- **UI 구현**: 
    - 상단 벨 아이콘과 `notification-inbox` 드롭다운 UI 구현.
    - `animate-fade-in` 효과를 적용하여 새로운 알림 수신 시 시각적 피드백 제공.

## 3. 통합 포트폴리오 관제 (Command Center - Phase 11)

### 3.1 통합 관제 대시보드 (`PortfolioCommandCenter.jsx`)
- **AUM 모니터링**: 전체 운용 자산(AUM)의 통합 수치와 시장 변동에 따른 가치 증감(`impactData`)을 실시간 시각화.
- **리스크 히트맵**: 섹터별(Renewables, Infra, Tech) 비중과 리스크 집중도를 히트맵 형식을 빌려 직관적으로 표현.
- **매크로 임팩트 예보 (Forecast)**:
    - `HIKE`, `VOLATILE`, `SHOCK` 시나리오 선택 시, 즉각적으로 포트폴리오 DSCR과 자산 가치 변동폭(`Impact Forecast`)을 계산하여 표시.
    - **로직 상세**: 고정된 하락 전이 계수(Deltas)를 기반으로 하여 매크로 환경 변화 시의 리스크 프로파일 변화를 사전 시뮬레이션 및 시각화.

## 4. UI 구성 요소 (Command Logic)
- **Macro Scenario Buttons**: 루시드 아이콘(`Globe`, `TrendingUp`, `Zap`, `ShieldAlert`)을 활용한 시나리오 선택기.
- **Real-time Stat Cards**: AUM 및 리스크 점수의 실시간 변화를 골드/네온 블루 테두리로 강조하여 금융 터미널 느낌 강화.
