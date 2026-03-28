# IB 현업 + Book Building 엔진 통합 설계 문서 (실무형)

---

# 1. IB 현업 개요

## 1.1 본질

딜 발굴 → 데이터 수집 → 분석 → 구조 설계 → 투자자 설득 → 가격 결정 → 실행

IB는 단순 금융이 아니라  
**데이터 + 모델 + 시장 심리 기반 의사결정 시스템**

---

# 2. IB 현업 업무 흐름 (실제 운영 기준)

## 2.1 시장 체크 (Market Monitoring)

- 국고채 금리
- IRS 금리
- 주식 시장 분위기
- 최근 IPO / 채권 발행 결과

→ 딜 조건 결정의 기준 데이터

---

## 2.2 데이터 수집 (Data Gathering)

- 재무제표 (3~5년)
- 사업보고서 (DART)
- 산업 데이터
- Comparable 기업 데이터

→ ETL + 정제 + 구조화

---

## 2.3 Valuation (기업 가치 평가)

사용 모델:

- PER
- EV/EBITDA
- DCF

결과:

→ 기업 가치 Range 산출  
(예: 8,000원 ~ 10,000원)

---

## 2.4 Structuring (딜 구조 설계)

### IPO

- 공모 물량 결정
- 신주 / 구주 비율
- 할인율 설정

### DCM

- 만기 구조 (3년, 5년 등)
- 금리 구조 (고정 / 변동)
- Credit Spread 결정

핵심:

→ 시장 + 리스크 + 투자자 성향 반영

---

## 2.5 Pitch / IR

- 투자 포인트 설계
- 기업 스토리 구성
- 투자자 설득

핵심 역량:

→ 데이터를 “스토리”로 변환

---

## 2.6 Book Building (수요예측)

투자자 주문 수집:

```
A 기관 → 9,000원 / 100억
B 기관 → 8,500원 / 200억
C 기관 → 9,200원 / 50억
```

처리:

- 가격별 수요 집계
- 수요곡선 생성
- 이상치 제거

---

## 2.7 Pricing (가격 결정)

고려 요소:

- 수요곡선
- 투자자 Quality
- 시장 상황
- 상장 후 안정성

결정:

→ 최종 공모가 / 금리

---

## 2.8 Closing

- 자금 납입
- 배정 완료
- 딜 종료

---

# 3. IB 시스템 아키텍처

```
[기업 데이터] → Valuation Engine
[시장 데이터] → Spread Engine
[투자자 주문] → Book Building Engine

→ Pricing Engine

→ Output: 공모가 / 금리
```

---

# 4. 데이터 모델 (핵심 테이블)

## COMPANY

```
COMPANY
- company_id
- name
- industry
- credit_rating
- revenue
- net_income
```

---

## DEAL

```
DEAL
- deal_id
- company_id
- deal_type (IPO / BOND)
- target_amount
- status
```

---

## ORDER_BOOK (핵심)

```
ORDER_BOOK
- order_id
- deal_id
- investor_id
- price
- quantity
- investor_type
- timestamp
```

---

## INVESTOR

```
INVESTOR
- investor_id
- name
- type (Long-term / Hedge / Retail)
- weight
```

---

# 5. Book Building 엔진 설계

## 5.1 입력 데이터

- 가격별 주문
- 투자자 유형
- 공모 물량

---

## 5.2 처리 흐름

### 1) 가격 정렬

```
가격 DESC 정렬
```

---

### 2) 누적 수요 계산

```
cumulative_demand += quantity
```

---

### 3) Demand Ratio

```
Demand Ratio = 누적 수요 / 공모 물량
```

---

### 4) 가중 수요 계산

```
Weighted Demand = Σ (quantity × investor_weight)
```

투자자 가중치:

| 투자자 유형 | Weight |
|------------|--------|
| 장기 기관 | 1.2 |
| 일반 기관 | 1.0 |
| 단기 | 0.7 |

---

### 5) 이상치 제거

```
if price > 상단밴드 * 1.2:
    제거
```

---

### 6) 최적 가격 선택

조건:

- Demand Ratio ≥ 1
- Weighted Demand 최대
- 투자자 Quality 우수

---

## 5.3 수요곡선

Price ↑ → Demand ↓

---

## 5.4 최종 가격 결정 알고리즘

```
for price_level:
    if demand_ratio >= 1:
        candidate_prices.append(price)

final_price = max(candidate_prices)
```

---

# 6. Pricing Engine 통합

## IPO

```
Valuation → Price Band → Book Building → Final Price
```

---

## DCM

```
Benchmark Rate → Spread → Demand Adjustment → Final Yield
```

---

# 7. 고급 모델 확장

## 7.1 ML 기반 공모가 예측

입력:

- 재무 데이터
- 성장률
- 시장 분위기
- 수요 데이터

모델:

- LightGBM

출력:

- 적정 공모가

---

## 7.2 Spread 모델

```
Spread = f(신용등급, 부채비율, 금리, 시장상황)
```

---

# 8. 실무 핵심 인사이트

## 8.1 시장 심리가 가장 중요
→ 모델보다 시장 분위기

## 8.2 투자자 Quality 중요
→ 같은 수요라도 다르게 평가

## 8.3 After Market 중요
→ 상장 후 안정성까지 고려

---

# 9. 시스템 관점 정의

## IB = 실시간 의사결정 시스템

### 입력
- 기업 데이터
- 시장 데이터
- 투자자 주문

### 처리
- Valuation 모델
- Spread 모델
- Book Building 엔진

### 출력
- 공모가
- 채권 금리

---

# 10. 확장 아키텍처 (실무형)

```
Kafka → 주문 데이터 수집
↓
Spring Boot API
↓
Book Building Engine
↓
Oracle DB
↓
Pricing Engine
↓
결과 API
```

---

# 11. 결론

IB 시스템은 다음과 같이 정의된다:

> 금융 + 데이터 + 시장 심리가 결합된 실시간 가격 결정 시스템