# Phase 15: 글로벌 자산 모니터링 및 실시간 리스크 전파 시스템 (Deep Dive)

## 1. 개요 (Abstract)
Phase 15에서는 단일 딜 중심의 리스크 분석을 넘어, 전 세계에 분산된 IB 자산 간의 상관관계를 분석하고 특정 충격이 전체 네트워크로 파급되는 'Ripple Effect'를 시뮬레이션하는 시스템을 구축하였습니다. 이를 위해 지리 정보 시스템(GIS) 기반의 모니터링 UI와 비선형 리스크 전파 엔진을 도입하였습니다.

## 2. 주요 기술 스택 (Tech Stack)
- **Backend**: Spring Boot, Jakarta Persistence (Entity: `GlobalAsset`, `AssetRiskLink`)
- **Frontend**: React, `react-simple-maps` (World Topography), `d3-geo`
- **Visualization**: Lucide Icons, Custom CSS Animations (Shockwave, Pulse Effects)

## 3. 핵심 알고리즘: 비선형 리스크 전파 (Implementation)

### 3.1 전파 모델 (Sigmoid Shock Model)
전통적인 선형 전파 모델은 임계점을 넘어서는 급격한 위기 전이(Contagion)를 설명하지 못합니다. 본 프로젝트에서는 다음과 같은 비선형 증폭 논리를 적용하였습니다:

$$Risk_{target} = Risk_{source} \times Weight \times Multiplier(Risk_{source})$$

여기서 $Multiplier$는 $Risk_{source}$가 특정 임계값(Threshold, 70점)을 넘을 때 급격히 증가하도록 설계되었습니다:

```java
double multiplier = 1.0;
if (shockAmount > 70) {
    multiplier = 1.0 + (1.0 / (1.0 + Math.exp(-0.2 * (shockAmount - 85))));
}
```

### 3.2 데이터 구조
- **T_IB_GLOBAL_ASSET**: 자산의 위도/경도, 지역, 자산 유형, 가치 및 베이스 리스크를 저장.
- **T_IB_ASSET_RISK_LINK**: 자산 간의 의존성 유형(Supply Chain, Financial 등)과 전파 가중치 정의.

## 4. UI/UX 디자인 (Command Center)
- **Map Layer**:인터넷 없이 작동 가능한 `react-simple-maps` 기반의 벡터 맵 레이어로 구성.
- **Shockwave Effect**: 리스크 발생 시 해당 노드에서 원형 충격파가 퍼져나가는 애니메이션을 적용하여 직관적인 위기 전이를 묘사.
- **Propagation Chain Panel**: 전파 경로와 최종 포트폴리오 임팩트를 실시간으로 분석하여 사이드 패널에 표기.

## 5. 결론 및 향후 과제
Phase 15를 통해 글로벌 자산에 대한 전방위 관제가 가능해졌으며, 특정 충격에 대한 선제적 대응(Action Recommendation)이 가능해졌습니다. 향후 Phase 16에서는 이러한 전파 결과를 바탕으로 한 '자동 헤징(Auto-Hedging) 전략 실행'으로 확장을 계획하고 있습니다.
