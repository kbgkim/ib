# Phase 4: Risk Scoring Engine (Deep Dive)

## 1. 개요 (Overview)
본 문서는 M&A 리스크 분석의 핵심 지표인 **종합 리스크 점수(Risk Score)**를 산출하는 엔진의 수학적 정규화 및 가중치 집계 로직을 상세히 기록합니다.

## 2. 리스크 정규화 및 집계 (Normalization & Aggregation)

### 2.1 4대 분석 범주 (Risk Categories)
- **Financial (재무)**: 인수 가액, 배당 수익률 등을 기반으로 한 경제적 리스크.
- **Legal (법무)**: 계약 위반, 소송 가능성 및 규제 준수 여부.
- **Operational (운영)**: 자산 관리 실무, 설비 노후도 및 운영 효율성.
- **Security (보안/VDR)**: 데이터룸 접근 로그 분석 기반의 내부 통제 리스크.

### 2.2 수학적 정규화 알고리즘
- **정규화**: 각 범주의 서로 다른 입력값(통화, 비율, 빈도 등)을 0(Safe)에서 100(High Risk) 사이의 점수로 정규화.
- **가중치 브릿지 (Interactive Weighting)**:
    - 사용자가 UI 상단에서 3대 가중치(Financial, M&A Ops, Strategic)를 조절하면, 시스템 대시보드의 실시간 종합 점수가 비례적으로 업데이트됨.
    - **자동 보정 시스템**: 한 가중치를 변경하면 나머지 가중치가 합계 100%를 유지하도록 자동 조정되는 슬라이더 인터페이스 구현.

## 3. 리스크 등급 산출 (Risk Grading)

- **산식**: `Total_Risk_Score = sum(Category_Score[i] * Weight[i]) / 100`
- **등급 매핑**:
    - **AAA ~ AA**: 0 - 20 (Safe)
    - **A ~ BBB**: 21 - 40 (Warning)
    - **BB ~ B**: 41 - 60 (Caution)
    - **CCC ~ D**: 61 - 100 (Breach/High Risk)

## 4. UI 구성 요소 (Risk Visualization)
- **Risk Radar Chart**: 4-Axis 레이더 차트를 통해 어느 분야의 리스크가 돌출되어 있는지 직관적으로 시각화.
- **Dynamic Waterfall**: 각 리스크 요인이 최종 평가 가치(NPV)를 얼마나 삭감(Erosion)하는지 보여주는 워터폴 차트 통합.
