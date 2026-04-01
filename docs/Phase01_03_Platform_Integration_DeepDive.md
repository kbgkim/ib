# Phase 1-3: Platform Integration & Architecture (Deep Dive)

## 1. 개요 (Overview)
본 문서는 IB 통합 플랫폼의 근간이 되는 **M&A 리스크 엔진**과 **PF(Project Finance) 엔진**의 통합 설계 및 데이터 영속화 아키텍처를 상세히 기록합니다.

## 2. 통합 모듈 아키텍처 (Unified Architecture)

### 2.1 마이크로서비스 및 통신 구조
- **`ib-mna-engine` (8080)**: 기업 가치평가 및 정밀 리스크 분석 담당.
- **`ib-pf-engine` (8082)**: 프로젝트 파이낸스 현금흐름 및 자본 구조 시뮬레이션 담당.
- **`ib-ui-web` (React/Vite)**: 단일 진입점(Single Entry Point)으로서 두 엔진의 데이터를 통합하여 프리미엄 대시보드에 시각화.

### 2.2 PF 현금흐름 Waterfall 엔진 (Cash Flow Waterfall)
- **로직 상세**: 연도별 가용 현금흐름(`CFADS`)을 사전에 정의된 우선순위에 따라 배분.
    1. **OpEx**: 운영비 지출.
    2. **Tax**: 법인세 납부.
    3. **Senior Debt Service**: 선순위 대출 원리금 상환.
    4. **DSRA**: 원리금 상환 적립금(Debt Service Reserve Account) 보충.
    5. **Mezzanine/Junior Debt**: 중순위/후순위 상환.
    6. **Dividend**: 주주 배당.
- **주요 지표**: 
    - **DSCR**: `CFADS / Debt Service`.
    - **LLCR**: 잔여 프로젝트 현금흐름의 현재가치 대비 잔여 부채 비율.

## 3. 데이터 영속화 및 시나리오 관리 (Persistence)

### 3.1 DB 스키마 설계 (PostgreSQL)
- **`pf_project`**: 프로젝트 기본 정보 (Name, Total Capex, Timeline).
- **`pf_scenario`**: 특정 시점의 시뮬레이션 결과 및 파라미터 스냅샷을 JSONB 형식으로 저장.
    - `parameters`: 입력 변수(WACC, Cost Increase 등) 저장.
    - `metrics`: 산출된 지점(DSCR, LLCR) 저장.
    - `waterfall_data`: 연도별 배분 결과 배열 저장.

### 3.2 State Restore (상태 복구) 메커니즘
- 사용자가 과거 시나리오를 '로드'할 때, DB의 JSONB 데이터를 파싱하여 대시보드의 모든 상태(React States)를 즉시 초기화하는 동기화 로직 구현.

## 4. 디자인 시스템 (UI/UX Foundation)
- 초기 통합 단계에서 **Glassmorphism** 디자인 시스템을 공통 테마로 채택.
- `App.jsx` 레벨에서 레이아웃 프레임워크를 구축하여 M&A와 PF 탭 간의 매끄러운 전환(Tab Switching) 지원.
