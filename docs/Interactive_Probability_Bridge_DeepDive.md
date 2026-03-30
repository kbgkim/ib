# Deep Dive: Interactive Probability Bridge (v1.5)

본 문서는 M&A 시뮬레이터 고도화의 핵심인 **Interactive Probability Bridge** 모델의 기술적 상세와 사용자 가이드를 제공합니다.

## 1. 아키텍처 개요

기존의 단일 시나리오 선택 방식에서 탈피하여, 세 가지 핵심 시나리오(Bear, Base, Bull)의 확률 가중치를 실시간으로 합성하는 구조입니다.

### 핵심 구성 요소
- **Backend (Spring Boot)**: 모든 시나리오의 기초 데이터(Multiplier 적용 결과)를 단일 API(`/api/v1/mna/full-scenario-data`)로 서빙.
- **Frontend (React/Chart.js)**:
  - **Auto-balancing Slider**: 비중 합계 100%를 강제 유지하는 비례 배분 로직.
  - **Latency-Free Computation**: 가중 평균 계산을 클라이언트 사이드(`useMemo`)에서 처리하여 최상의 반응성 구현.
  - **Sensitivity Range Rendering**: `Chart.js` 플러그인을 통한 에러 바(Error Bar) 커스텀 렌더링.

---

## 2. 수식 및 로직

### 가중 평균 계산 (Weighted Average)
최종 표시되는 각 지표($V_{weighted}$)는 다음과 같이 계산됩니다.

$$V_{weighted} = \sum_{i \in \{Bear, Base, Bull\}} (V_{i} \times W_{i})$$

- $V_{i}$: 해당 시나리오에서의 지표 값 (예: 비용 시너지)
- $W_{i}$: 해당 시나리오에 부여된 확률 가중치 ($\sum W_i = 1.0$)

### 비중 자동 보정 (Proportional Auto-balancing)
사용자가 특정 시나리오 $j$의 가중치($W_j$)를 변경했을 때, 나머지 $W_{others}$는 다음과 같이 보정됩니다.

$$\Delta = W_{j, new} - W_{j, old}$$
$$W_{k, new} = \max(0, W_{k, old} - \Delta \times \frac{W_{k, old}}{\sum W_{others}})$$

---

## 3. UI/UX 디자인 원칙

### 시각적 시인성 (Visual Clarity)
- **보수적 (Bear)**: Red (#ef4444) - 하방 리스크 경고.
- **표준 (Base)**: Blue (#3b82f6) - 기댓값 중심.
- **낙관적 (Bull)**: Green (#10b981) - 상방 잠재력.

### 에러 바 (Sensitivity Range)
Waterfall 차트의 각 막대 중앙을 관통하는 수직선은 해당 항목이 **100% Bear**일 때와 **100% Bull**일 때 가질 수 있는 이론적 범위를 보여줍니다. 이를 통해 사용자는 어떤 항목이 가장 리스크(변동성)가 큰지 즉각적으로 판단할 수 있습니다.

---

## 4. 향후 확장성

1. **상세 시나리오 커스터마징**: 각 시나리오별 멀티플(0.7, 1.0, 1.3) 자체를 사용자가 수정할 수 있는 어드밴스드 모드 통합 가능.
2. **ML 기반 확률 추천**: 과거 딜 데이터를 바탕으로 ML 엔진이 최적의 확률 비중(Weights)을 자동으로 제안하는 기능 연동 예정.
