# PF(Project Finance) 실무 종합 가이드 + 실시간 모니터링

---

## 1. PF 개념 요약

- **PF(Project Finance)**: 특정 프로젝트의 **현금흐름**을 담보로 자금을 조달하는 금융 기법
- 특징: 프로젝트 자체 Cash Flow 기반, 대주체 자산과는 분리
- 참여 주체: 은행, 증권사, 투자자, 시공사 등
- **초보자 관점**: “프로젝트 자체 돈과 위험으로만 운영되는 전용 통장”

---

## 2. PF 핵심 용어 (초보자 관점)

| 용어 | 뜻 | 초보자 관점 |
|------|-----|-------------|
| SPV | 프로젝트 전용 법인 | 프로젝트만 전용으로 만든 회사, 돈과 위험이 분리된 통장 |
| DSCR | 차입금 상환 능력 지표 | 현금이 빚 갚기에 충분한지 확인, 1 이상이면 안전 |
| LTV | 담보 대비 대출 비율 | 집값 100억인데 80억 빌렸으면 LTV 80%, 높으면 위험 |
| Cash Flow | 현금 유입/유출 | 프로젝트에서 들어오고 나가는 돈의 흐름 |
| Tranche | 투자금/대출을 위험/수익 수준별로 나눈 조각 | 피자를 나누듯 안전한 조각부터 위험한 조각까지 나눈 것 |
| Default Probability | 부도 확률 | 빚을 못 갚을 확률, 높으면 위험 |
| Risk Grade | 리스크 등급 | 신용등급처럼 프로젝트 위험 단계 표시, AAA~High Risk |

---

## 3. Tranche 구조

```text
Project Cash Flow
       │
┌──────┴───────┐
│ Senior Tranche │ → 안정적, 낮은 금리, 상환 우선권
├───────────────┤
│ Mezzanine Tranche │ → 중간 위험, 중간 수익
├───────────────┤
│ Equity / Junior Tranche │ → 고위험, 고수익, 상환 마지막
└───────────────┘
Cash Flow 기반 상환 순서:
프로젝트 수익 → Senior Tranche → Mezzanine Tranche → Equity/Junior Tranche
4. PF Deal 참여 주체
주체	역할
은행	Loan 제공, DSCR/LTV 관리, 담보 확보
증권사	투자자 모집, Tranche 구조 설계, 채권 발행
투자자	Tranche별로 투자, 수익과 위험 감수
SPV	프로젝트 Cash Flow 운용, 투자금 관리
5. PF 전체 Cash Flow + 리스크 흐름
                  ┌─────────────┐
                  │ 투자자 A/B/C│
                  └─────┬───────┘
                        │ 투자금
                        ▼
                  ┌─────────────┐
                  │  증권사 SPV  │
                  │(Tranche 설계)│
                  └─────┬───────┘
                        │ 프로젝트 자금
                        ▼
                  ┌─────────────┐
                  │ 프로젝트 SPV │
                  │ (건설/운영) │
                  └─────┬───────┘
                        │ Cash Flow 발생
                        ▼
      ┌───────────────────────────────┐
      │  상환 / 이익 분배 / Fee 지급 │
      └─────┬───────────────┬───────┘
            │               │
            ▼               ▼
     ┌───────────┐     ┌────────────┐
     │ 투자자 A  │     │ 증권사 Fee │
     └───────────┘     └────────────┘
6. 실시간 PF 리스크 모니터링 구조
[데이터 소스] → Kafka / Streaming
      │
      ▼
[Feature 계산 엔진: DSCR, LTV, 분양률, 금리 민감도]
      │
      ▼
[ML 부도 예측 (LightGBM): Default Probability 계산]
      │
      ▼
[Risk Scoring & Alert 판단 → Risk Grade 산출]
      │
      ▼
[DB/Redis 저장]
      │
      ▼
[대시보드 시각화 / 알림: 이메일, Slack, SMS]
7. LightGBM 기반 Default Probability 예측 (Python 예시)
import lightgbm as lgb
import pandas as pd

# 데이터 로드
df = pd.read_csv("pf_features.csv")
X = df.drop(columns=['default_flag'])
y = df['default_flag']

# LightGBM Dataset
train_data = lgb.Dataset(X, label=y)

# 모델 학습
params = {
    'objective': 'binary',
    'metric': 'binary_logloss',
    'learning_rate': 0.05,
    'num_leaves': 31,
    'verbose': -1
}
model = lgb.train(params, train_data, num_boost_round=100)

# 예측
df['default_prob'] = model.predict(X)
df[['project_id', 'default_prob']].head()
8. 실시간 데이터 연동 (Spring Boot + Kafka 예시)
Kafka 토픽: pf-cashflow
Spring Boot 컨슈머 예시:
@KafkaListener(topics = "pf-cashflow", groupId = "pf-monitor")
public void consumePfData(PfEvent event) {
    double dscr = calculateDSCR(event);
    double ltv = calculateLTV(event);
    double defaultProb = model.predict(event.features());
    
    RiskGrade grade = evaluateRisk(dscr, ltv, defaultProb);
    saveToRedis(event.getProjectId(), dscr, ltv, defaultProb, grade);
    
    if (grade.isHighRisk()) {
        alertService.sendAlert(event.getProjectId(), grade);
    }
}
9. 대시보드 KPI 예시
항목	설명
DSCR / LTV	실시간 안정성 지표
Default Probability	ML 모델 예측 부도 확률
Risk Grade	AAA~High Risk
Cash Flow	월별/주별 현금 흐름
Sales / Progress Rate	분양률, 진행률
Alert	DSCR<1, LTV>80%, Default Prob>30%
Cash Flow (월별)
┌─────────────┐
│ 120         │  ■■■■■■■■■■
│ 100         │  ■■■■■■■■■
│ 80          │  ■■■■■■■
│ 60          │  ■■■■■
│ 40          │  ■■■
│ 20          │  ■
└─────────────┘
Jan Feb Mar Apr May

Alert 예시:

[ALERT]
프로젝트: P001
DSCR: 0.92
LTV: 82%
Default Prob: 38%
Risk Grade: High Risk
조치: 담당자 확인 필요
10. 요약
데이터 → Feature 계산 → ML 예측 → Risk Grade → Alert → 대시보드 시각화
             ↑
             └ 리스크 포인트: DSCR/LTV 저하, 분양률 저조, Cash Flow 부족