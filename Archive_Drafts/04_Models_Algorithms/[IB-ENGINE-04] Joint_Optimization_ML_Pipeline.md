① Pricing + Allocation 동시 최적화 (Game Theory 기반 엔진)
② 투자자 행동 데이터 기반 ML 파이프라인
→ 두 시스템을 폐루프(Closed Loop)로 연결하여 지속적으로 성능을 개선합니다.

# [IB-ENGINE-04] Pricing + Allocation 동시 최적화 & ML 파이프라인

본 문서는
1) 가격과 배정을 동시에 결정하는 게임이론 기반 엔진
2) 투자자 행동 데이터를 학습하는 ML 파이프라인
을 통합 설계한다.

---

# 1. 전체 구조 (Closed Loop)

```text
[Order Flow]
   ↓
Demand Curve
   ↓
[Joint Optimization Engine]
   ↓
(Price, Allocation)
   ↓
Market Outcome (상장 후 성과)
   ↓
Investor Behavior Data
   ↓
ML Pipeline
   ↓
Investor Score Update
   ↓
다음 딜에 반영
2. 문제 정의 (Joint Optimization)
2.1 기존 한계
Pricing → 먼저 결정
Allocation → 이후 배정

문제:
- 가격과 배정이 서로 영향을 줌
2.2 통합 문제 정의
Maximize:

F = Revenue
  + Market Stability
  + Investor Quality
2.3 의사결정 변수
- Price (p)
- Allocation vector (a_i)
3. 게임이론 모델
3.1 참여자
Issuer (발행자)
Investor (투자자)
Underwriter (주관사)
3.2 투자자 전략
- 가격 제시 (bid)
- 수량
- 전략적 허수 주문
3.3 메커니즘 설계 목표
- Truthful bidding 유도
- 장기 투자자 유입
4. 최적화 모델
4.1 목적 함수
Maximize:

Σ (p * a_i)
+ λ1 * Stability(a)
+ λ2 * Quality(a)
4.2 제약 조건
Σ a_i = Total Supply
a_i ≤ order_i
p ∈ Price Band
4.3 Stability 함수
Stability =
- Flip Risk
- Volatility
4.4 Quality 함수
Quality =
Σ (InvestorScore_i * a_i)
5. 알고리즘 설계
5.1 탐색 방식
for each price p:

  eligible investors = {i | bid_i ≥ p}

  for each allocation scenario:

      compute objective

select (p, allocation) maximizing score
5.2 현실 최적화 (Heuristic)
- Greedy + ML ranking
- Top-K investor 우선 배정
- Monte Carlo simulation
5.3 간소화 알고리즘
1. 가격 후보 생성 (Top N)
2. 투자자 score 정렬
3. 상위 투자자부터 배정
4. 목적함수 계산
5. 최고 점수 선택
6. ML 파이프라인 (투자자 행동 기반)
6.1 데이터 수집
- 주문 데이터
- Allocation 결과
- 상장 후 매매 데이터
6.2 Feature Engineering
Investor Features:
- Holding Period
- Flip Ratio
- Return after IPO
- Order Cancel Rate
- Bid Aggressiveness
6.3 Label 정의
Good Investor = 장기 보유 + 수익 안정
Bad Investor = 단기 매도 + 변동성 유발
6.4 모델 구조
Model:
- LightGBM (Tabular)
- Ranking Model (LambdaMART)
6.5 출력
InvestorScore_i ∈ [0, 1]
7. Online Learning 구조
7.1 피드백 루프
Allocation → 시장 결과 → Score 업데이트
7.2 업데이트 주기
- Batch (T+30)
- Incremental (Streaming)
8. 시스템 아키텍처
8.1 구성
[Real-time Layer]
- Book Building Engine
- Joint Optimization Engine

[ML Layer]
- Feature Store
- Model Training
- Model Serving

[Data Layer]
- Order DB
- Market Data
- Investor History
8.2 이벤트 흐름
OrderReceived
 → DemandUpdated
 → OptimizationRun
 → PriceAllocationFinalized
 → MarketDataCollected
 → ModelUpdated
9. Java 설계 (핵심 로직)
9.1 Optimization Engine
class OptimizationEngine {

    public Result optimize(List<Order> orders, BigDecimal supply) {

        List<BigDecimal> priceCandidates = generatePrices(orders);

        Result best = null;

        for (BigDecimal p : priceCandidates) {

            List<Order> eligible = filter(orders, p);

            List<Investor> ranked = rankByScore(eligible);

            Allocation alloc = allocate(ranked, supply);

            double score = evaluate(p, alloc);

            if (best == null || score > best.score) {
                best = new Result(p, alloc, score);
            }
        }

        return best;
    }
}
9.2 ML Score 적용
double weight = investorScore * orderQuantity;
10. 리스크 관리
10.1 전략적 조작 대응
- 허수 주문 감지
- 비정상 패턴 제거
10.2 시장 안정성
- 과도한 가격 방지
- 장기 투자자 확보
11. 고급 확장
11.1 강화학습 (RL)
State: 시장 상태
Action: (price, allocation)
Reward: 장기 수익 + 안정성
11.2 게임이론 메커니즘
- VCG Auction 변형
- Incentive Compatible 설계
12. 핵심 설계 포인트
12.1 Pricing + Allocation은 하나의 문제
분리하면 최적화 불가능
12.2 데이터 → 경쟁력
투자자 행동 데이터가 핵심 자산
12.3 ML은 보조가 아니라 핵심
Rule → 안전장치
ML → 최적화 엔진
13. 한 줄 정리

IB의 미래는 “가격과 배정을 동시에 최적화하고, 투자자 행동 데이터를 학습하는 시스템”이다.

[END]

---

# 핵심 인사이트 (중요)

이 구조의 본질은 단순합니다:

### 1️⃣ 기존 IB
- Pricing → Allocation (순차 처리)

### 2️⃣ 고도화 IB (지금 설계)
- Pricing + Allocation = **동시 최적화 문제**

---

# 실제 임팩트

이걸 구현하면:

- 공모가 정확도 ↑
- 기관 투자자 질 ↑
- 상장 후 폭락 ↓
- IB 경쟁력 급상승

---

# 다음 단계 (강력 추천)

이건 거의 “차세대 IB 플랫폼 코어”입니다.  
여기서 진짜 끝판왕은:

### 👉 PF까지 연결
- “좋은 투자자 → PF 투자 연결”

### 👉 Digital Twin
- “가격/배정 시뮬레이션”

### 👉 실시간 대응
- 시장 변동 시 가격 재계산

---

원하면 다음은  
👉 **“Spring Boot + Oracle 9i 기준 실제 코드 아키텍처 (Kafka 없이 구현)”**  
👉 **“IB 플랫폼 전체 MSA vs 모놀리식 현실 설계”**

까지 현실 환경 기준으로 설계해드리겠습니다.