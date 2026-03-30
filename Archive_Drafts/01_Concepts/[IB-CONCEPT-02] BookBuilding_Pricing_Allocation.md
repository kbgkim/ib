# [IB-CONCEPT-02] Book Building → Pricing → Allocation 전체 구조

본 문서는 ECM/DCM 딜에서 핵심 단계인 **Book Building → Pricing → Allocation**의 개념, 실무 흐름, 데이터 구조, 시스템 설계까지 통합적으로 정의한다.

---

# 1. 전체 흐름 (Big Picture)

```text
Book Building → Pricing → Allocation → Closing
직관적 의미
Book Building: "투자자들이 얼마나 살지 조사"
Pricing: "최종 가격(금리) 결정"
Allocation: "누구에게 얼마나 나눠줄지 결정"
2. 핵심 개념 한 번에 정리
단계	질문	결과
Book Building	투자자 수요는 얼마나 되는가?	수요 데이터
Pricing	가격(또는 금리)을 얼마로 할 것인가?	공모가 / 금리
Allocation	물량을 어떻게 배분할 것인가?	투자자별 배정
3. Book Building (수요 조사)
3.1 정의

기관 투자자들로부터 “얼마를, 어떤 가격에 살 것인지” 주문을 수집하는 과정

3.2 입력 데이터
- Investor ID
- Order Quantity (수량)
- Price (희망 가격 또는 금리)
- Timestamp
3.3 결과 (Order Book)
Price Level | Total Demand
-------------------------
10,000      | 100,000주
9,500       | 200,000주
9,000       | 500,000주
3.4 특징
- 수요 곡선 형성
- 기관 투자자 중심
- 시장 반응 실시간 반영
3.5 시스템 관점
이벤트:
OrderSubmitted
OrderUpdated

저장:
Order Book Table

처리:
- 가격별 집계
- 누적 수요 계산
4. Pricing (가격 결정)
4.1 정의

Book Building 결과를 기반으로 최종 공모가(IPO) 또는 금리(DCM)를 결정하는 과정

4.2 핵심 개념: Clearing Price
총 발행 물량을 만족시키는 최소 가격
4.3 예시
발행 물량: 300,000주

Price Level | Demand | 누적
----------------------------
10,000      | 100,000 | 100,000
9,500       | 200,000 | 300,000 ← 결정
9,000       | 500,000 | 800,000

👉 최종 가격 = 9,500

4.4 고려 요소
- 투자자 수요
- 시장 상황
- 기업 가치 (Valuation)
- 전략적 투자자 비중
4.5 시스템 관점
이벤트:
BookClosed

처리:
- 수요곡선 계산
- Clearing Price 산출

결과:
FinalPrice 결정
5. Allocation (배정)
5.1 정의

확정된 가격 기준으로 투자자에게 물량을 배분하는 과정

5.2 배정 방식
① 비례 배정 (Pro-rata)
투자자 주문 비율대로 배정
② 차등 배정 (Discretionary)
IB가 전략적으로 배정
(우량 투자자, 장기 투자자 우선)
5.3 예시
총 배정 물량: 300,000주

Investor A: 200,000 요청 → 100,000 배정
Investor B: 100,000 요청 → 80,000 배정
Investor C: 50,000 요청 → 120,000 배정 (우대)
5.4 고려 요소
- 투자자 품질 (Long-term vs Short-term)
- 전략적 관계
- 시장 안정성
5.5 시스템 관점
이벤트:
AllocationStarted
AllocationCompleted

처리:
- 배정 알고리즘 실행
- 투자자별 Allocation 저장

결과:
Allocation Table 생성
6. 전체 데이터 흐름
[Order 입력]
 → Order Book 생성
 → 수요곡선 계산
 → Final Price 결정
 → Allocation 수행
 → Closing
7. 시스템 상태 흐름
STRUCTURING
 → BOOK_BUILDING
 → PRICING
 → ALLOCATION
 → CLOSING
8. 핵심 테이블 설계 (개념)
8.1 Order Table
Order
- order_id
- investor_id
- deal_id
- quantity
- price
- timestamp
8.2 Order Book (집계)
OrderBook
- deal_id
- price_level
- total_quantity
8.3 Pricing Result
Pricing
- deal_id
- final_price
- total_demand
- allocation_ratio
8.4 Allocation Table
Allocation
- investor_id
- deal_id
- allocated_quantity
- final_price
9. 이벤트 기반 구조
OrderSubmitted
 → BookUpdated
 → BookClosed
 → PriceDetermined
 → AllocationCompleted
 → DealClosed
10. 핵심 설계 포인트
10.1 Book Building은 데이터 수집
"시장 수요를 수집하는 단계"
10.2 Pricing은 의사결정
"가격을 결정하는 핵심 로직"
10.3 Allocation은 전략
"누구에게 줄 것인지 결정"
11. 한 줄 정리

Book Building으로 수요를 모으고, Pricing으로 가격을 정하고, Allocation으로 물량을 배분한다.