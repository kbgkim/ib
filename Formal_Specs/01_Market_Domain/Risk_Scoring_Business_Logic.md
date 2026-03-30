# [IB-DOM-02] 통합 리스크 스코어링 비즈니스 로직 (Risk Scoring Business Logic)

본 문서는 IB 플랫폼에서 **M&A 자문** 및 **PF 금융** 딜의 리스크를 정량적으로 평가하고 점수화(Scoring)하는 비즈니스 규칙을 정의합니다.

---

## 1. 리스크 평가 프레임워크 (Evaluation Framework)

통합 리스크 점수는 4가지 핵심 카테고리의 가중 평균으로 산출됩니다.

### 1.1 리스크 카테고리 및 지표
| 카테고리 (Category) | 평가 항목 (Key Indicators) | 비중 (Weight) | 비즈니스 의미 |
|---|---|---|---|
| **재무 (Financial)** | DSCR, LTV, EBITDA Margin | 40% | 상환 능력 및 수익성 현금흐름 검증 |
| **법률 (Legal)** | Litigation, Change of Control | 20% | 계약적 결함 및 법적 우발 채무 검토 |
| **운영 (Operational)** | Synergy, Market Share | 20% | 사업 지속성 및 핵심 인력 유출 리스크 |
| **보안 (Security)** | VDR Level, Access Pattern | 20% | 실사 데이터 보안 및 정보 유출 위험 |

---

## 2. 세부 평가 로직 (Detailed Logic)

### 2.1 재무 리스크 (Financial Risk)
- **DSCR (Debt Service Coverage Ratio)**: 1.2x 이상일 때 만점(100점). 1.0x 미만일 경우 즉시 리스크 등급 하향.
- **[Business-Only] 민감도 분석 (Sensitivity Analysis)**: 
    - 원자재 가격이나 이자율 변동 시 **DSCR**이 어떻게 변하는지 시뮬레이션하여 최악의 시나리오(Worst-case)를 점수에 반영함.

### 2.2 법률 및 컴플라이언스 리스크 (Legal/Compliance)
- **Change of Control (경영권 변동 조항)**: M&A 시 대출금 조기 상환 의무가 발생하는지 체크. 존재 시 법률 리스크 점수 감점.
- **Litigation (소송)**: 진행 중인 소송의 가액이 기업 가치의 5%를 초과할 경우 고위험으로 분류.

### 2.3 보안 리스크 (Security/VDR Risk)
- **VDR Access Pattern**: 특정 IP에서 단시간에 대량의 문서를 다운로드하거나, 비인가 시간에 접근할 경우 보안 점수 급락.
- **Document Sensitivity**: NLP 분석을 통해 'Confidential' 키워드가 포함된 문서가 외부로 공유될 가능성 산출.

---

## 3. 리스크 등급 환산 (Grading Scale)

산출된 0-100점의 점수는 다음의 공식 등급으로 환산됩니다.

| 총점 (Score) | 등급 (Grade) | 정의 (Description) |
|---|---|---|
| 90 - 100 | **AAA** | 극히 낮은 리스크. 안정적인 수익 및 상환 보장. |
| 80 - 89 | **AA** | 낮은 리스크. 우수한 현금흐름 및 관리 체계. |
| 70 - 79 | **A** | 적정 리스크. 시장 상황에 따른 모니터링 필요. |
| 50 - 69 | **B** | 주의 리스크. 특이 사항 발생 시 대응 계획 필요. |
| 0 - 49 | **D** | 고위험. **EOD (Event of Default)** 발생 가능성 높음. |

---

## 4. [Business-Only] 산업별 가중치 배수 (Industry Multipliers)

개발 단계에서는 기본 가중치를 사용하지만, 실무에서는 산업군별로 특정 팩터의 중요도가 달라집니다.

- **건설/PF**: 운영 리스크보다 **재무(DSCR) 및 분양 리스크**에 1.5배 가중치 부여.
- **바이오/IT M&A**: 재무 지표보다 **IP(지식재산권) 및 법률 리스크**에 2.0배 가중치 부여.
- **전기/에너지**: **정부 인허가(Compliance)** 리스크가 최우선 순위.

> [!IMPORTANT]
> **개발자 참고 사항**
> 시스템 구현 시 `RiskEngine`은 위 산업별 가중치 테이블(`T_RISK_WEIGHT_MAP`)을 참조하여 동적으로 점수를 산출해야 합니다.

---

## 5. ML 연동 및 피처 엔지니어링 (Process)

1. **Raw Data**: 재무제표, VDR 로그, 계약서 텍스트.
2. **Feature Store**: 위 데이터를 정규화하여 ML 모델용 입력값으로 변환.
3. **ML Service**: 딥러닝 모델이 과거 부도/실패 데이터를 학습하여 **예측 리스크 점수 (Predictive Score)** 산출.
4. **Final Result**: 비즈니스 룰 엔진 점수와 ML 예측 점수를 결합하여 최종 리스크 등급 확정.
