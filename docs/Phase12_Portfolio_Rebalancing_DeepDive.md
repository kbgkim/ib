# Phase 12: AI Portfolio Rebalancing (Deep Dive)

## 1. 개요 (Overview)
본 문서는 IB 통합 플랫폼의 시나리오 기반 자산 배분 최적화 엔진인 **AI Portfolio Optimizer**의 기술 사양을 기록합니다.

## 2. 핵심 알고리즘 및 로직 (Core Logic)

### 2.1 시나리오 기반 가중치 조정 (Scenario Weighting)
- **목적**: 거시경제 시나리오(`NORMAL`, `HIKE`, `VOLATILE`, `SHOCK`)에 따라 섹터별 리스크 대비 기대 수익률을 최적화.
- **산식**: `Score = (100.0 / (AssetRisk + 1.0)) * ScenarioMultiplier`
    - `AssetRisk`: 섹터별 고유 리스크 상수 (예: TECH 45.8, INFRA 18.2).
    - `ScenarioMultiplier`: 시나리오별 섹터 가중치 (예: `HIKE` 시 INFRA 1.1, TECH 0.7).
- **최종 비중**: 각 섹터의 `Score` 합계를 100%로 환산하여 추천 비중 산출.

### 2.2 리스크 완화 예측 (Risk Reduction)
- **산식**: `Reduction = Current_Weighted_Risk - Optimized_Weighted_Risk`
- **시각화**: 최적화 적용 시 예상되는 리스크 점수 감소폭을 네온 그린(pts)으로 대시보드에 표기.

## 3. 프론트엔드 구현 (Frontend Implementation)

### 3.1 컴포넌트 구조
- **컴포넌트**: `AIPortfolioOptimizer.jsx`
- **주요 기능**:
    - **API 통신**: `axios.post`를 사용하여 `ib-ml-engine`의 `/rebalance` 엔드포인트 호출.
    - **상태 관리**: `recommendation` 상태를 통해 API 결과를 저장하고 비중 변화(`ArrowRight`) 시각화.
    - **설정 제어**: 고정 수수료(`fixedFee`) 등을 사용자가 직접 조정할 수 있는 설정 패널 제공.

### 3.2 UI/UX 디자인
- **Glassmorphism**: 반투명 패널과 `Target` 아이콘을 활용한 전문적인 투자 도구 느낌 강화.
- **애니메이션**: 최적화 실행 시 `RefreshCcw` 아이콘의 스핀 애니메이션 적용.

## 4. 백엔드 구현 (Backend Implementation)
- **파일**: `ib-ml-engine/app/api/optimizer.py`
- **프레임워크**: FastAPI + Pydantic.
- **특이사항**: API 호출 실패 시 프론트엔드에서 시나리오별 수동 밸런싱 로직(Fallback)을 작동시켜 서비스 연속성 보장.
