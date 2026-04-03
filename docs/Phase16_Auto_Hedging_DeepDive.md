# Phase 16: 지능형 자동 헤징(Auto-Hedging) 및 전략 실행 자동화 (Deep Dive)

## 1. 개요 (Abstract)
Phase 16에서는 Phase 15에서 구현된 글로벌 리스크 전파 데이터를 기반으로, 위험 상황에 즉각적으로 대응하기 위한 **전략 실행 자동화 계층(Execution Layer)**을 구축하였습니다. AI 추천 엔진이 자산별 최적의 헤징 상품을 매핑하고, 필요에 따라 완전 자동(Sentinel Mode)으로 시장에 대응할 수 있는 기능을 제공합니다.

## 2. 주요 기술 스택 (Tech Stack)
- **Backend Service**: `AutoHedgingService`, `HedgingStrategyRepository`
- **Execution Model**: Hybrid (Semi-Auto & Full-Auto/Sentinel)
- **Hedging Products**: FX Forward, CDS (Credit), Commodity Futures, **IRS (Interest Rate Swap)**
- **UI Architecture**: React-based `HedgingAdvisorPanel` integrated with Global Map

## 3. 핵심 아키텍처 (Implementation)

### 3.1 하이브리드 자동화 정책 (Automation Authority)
리스크의 심각도와 시스템 신뢰도에 따라 두 가지 실행 모드를 지원합니다.
- **One-click Mode**: AI가 전략을 제안하고 운영자가 UI에서 최종 승인 및 실행. (Default)
- **Sentinel Mode**: 리스크가 극단적 임계점(85점 이상)을 넘을 경우, 시스템이 사전 정의된 한도 내에서 전략을 즉각 자동 실행.

### 3.2 헤징 상품 매핑 로직 (Strategy Matching)
자산 유형과 리스크 성격에 따라 최적의 상품을 자동 선택합니다.
- **Currency Risk (FX)**: 해외 자산에 대해 USD/KRW 등 선물환(Forward) 매칭.
- **Default Risk (CREDIT)**: 공급망 및 인프라 자산에 대해 CDS 매칭.
- **Price Volatility (COMMODITY)**: 에너지 및 제조 자산에 대해 선물(Futures) 계약 매칭.
- **Interest Rate (INTEREST)**: 채권 및 대출 기반 자산에 대해 **IRS(금리 스왑)** 매칭 (Phase 16 신규 추가).

### 3.3 안전 장치 (Safety Rails)
Sentinel Mode의 오작동 및 시장 충격을 방지하기 위해 다음과 같은 제약 조건을 적용합니다.
- **Daily Execution Limit**: 하루 최대 자동 실행 금액 제한.
- **Confidence Threshold**: AI 엔진의 신뢰도 점수가 90% 이상일 때만 자동 실행 허용.
- **Circuit Breaker**: 비정상적인 연속 실행 감지 시 Sentinel 모드 즉시 강제 종료.

## 4. UI/UX 디자인 (Advisor Interface)
- **Real-time Slide Panel**: 글로벌 맵 상에서 리플(Ripple)이 감지된 노드 선택 시 즉시 우측에서 헤징 패널이 슬라이드 인.
- **Visual Feedback**: 헤징 실행 후 노드 색상이 안정화되는 연출을 통해 리스크 완화 시각화.
- **Mode Toggle**: 상단 스위치를 통해 Sentinel 모드 활성화 상태를 한눈에 파악.

## 5. 결론 및 향후 과제
Phase 16을 통해 IB 플랫폼은 단순히 위험을 '관찰'하는 수준을 넘어, 데이터를 기반으로 위기를 '처치'하는 실행 능력을 확보하였습니다. 향후 Phase 17에서는 이러한 실행 데이터의 사후 분석(Backtesting) 및 전체 시스템의 전방위적 보안 거버넌스 확립에 집중할 예정입니다.
