# ML Model Architecture Rationale: Risk Engine (v1.6)

본 문서는 IB 플랫폼 리스크 분석을 위한 ML 모델 선정 과정에서의 핵심 의사결정 사항과 기술적 근거를 기록합니다.

## 1. 알고리즘 선정: LightGBM vs RandomForest

### 분석 배경
M&A 딜 리스크는 비정형적이고 상호 연관된 피처들이 많으며, 데이터셋의 크기가 초기에는 작지만 서비스 운영에 따라 급격히 팽창할 가능성이 큽니다.

### 주요 고려 사항
| 항목 | RandomForest | LightGBM | 비고 |
| :--- | :--- | :--- | :--- |
| **안정성** | 소량 데이터에서 매우 안정적 | 파라미터 튜닝 시 안정적 | 초기 단계에서는 RF 우위 |
| **성능** | 보통 (CPU 병렬 처리) | 매우 빠름 (GPU 지원 가능) | 대용량 데이터에서 LGBM 압승 |
| **확장성** | 보통 | 높음 (Distributed 학습 가능) | 엔터프라이즈급 표준 |
| **해석성** | 뛰어남 (Gini/Entropy) | 뛰어남 (Gain/Split/SHAP 지원) | 설명 가능한 AI(XAI)에 적합 |

### 최종 결정: LightGBM (Gradient Boosting)
사용자의 피드백과 향후 확장성을 고려하여 **LightGBM**을 최종 알고리즘으로 선정했습니다. 
- **결정 근거**: 초기의 적은 샘플 수 문제는 합성 데이터 부트스트랩(Synthetic Bootstrapping)과 과적합 방지 파라미터(`min_data_in_leaf`) 설정을 통해 제어하고, 이후 실제 리스크 데이터가 축적될 때 업그레이드 비용 없이 즉각 대응하기 위함입니다.

---

### 2. 점수 체계 설계: Safe vs Risk

### 의사결정
- **내부 모델**: **Risk Probability (0.0 ~ 1.0)**를 도출. (ML 업계 표준이며 Loss 계산에 용이)
- **외부 서빙**: **Safety Score (0 ~ 100)**로 변환.
- **변환 공식**: `SafetyScore = 100 - (RiskProbability * 100)`

### 변환 사유
- 현재 Java 백엔드 및 React 대시보드(Radar Chart)는 "점수가 높을수록 안전한(좋은)" 체계를 사용하고 있습니다. 
- 사용자에게 혼란을 주지 않으면서도 모델 내부의 객관적 리스크 수치를 그대로 반영하기 위해 선형 변환(Linear Transformation) 방식을 채택했습니다.

---

### 3. 피처 중요도 및 투명성 (Explainability)

AI 분석 결과에 대한 신뢰도를 높이기 위해 다음과 같은 **XAI(Explainable AI)** 요소를 도입합니다.
- **Top 3 Risk Factors**: 모델의 예측에 가장 큰 기여를 한 피처 3개를 추출하여 명확한 요인 분석 정보 제공.
- **Contribution Ratio (%)**: 각 요인이 최종 리스크 점수에 미친 영향도를 백분율로 표기.

---

본 결정사항은 2026-03-31 부로 확정되었으며, `ib-ml-engine` 고도화 작업의 핵심 지침으로 활용됩니다.
