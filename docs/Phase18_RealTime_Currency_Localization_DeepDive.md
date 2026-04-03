# Phase 18: 실시간 환율 API 연동 및 로컬라이제이션 통합 상세 설계 (Deep Dive)

## 1. 개요 (Overview)

본 Phase 18에서는 IB 통합 플랫폼의 금융 데이터 신뢰성을 확보하기 위해 실시간 시장 데이터(USD/KRW 환율)를 백엔드 서비스에 연동하고, 이를 바탕으로 플랫폼 전반의 통화 표시 및 단위를 한국 금융 관행에 맞게 통합 고도화하였습니다.

## 2. 백엔드: 실시간 환율 서비스 (Market Data Service)

### 2.1 Frankfurter API 연동
- **엔드포인트**: `https://api.frankfurter.app/latest?from=USD&to=KRW`
- **구현 방식**: `RestTemplate`을 사용하여 외부 API를 주기적으로 호출(또는 요청 시 캐싱된 데이터 활용)하도록 `MarketDataService`를 구현했습니다.
- **데이터 구조**:
  ```json
  {
    "amount": 1.0,
    "base": "USD",
    "date": "2026-04-03",
    "rates": { "KRW": 1510.5 }
  }
  ```

### 2.2 장애 복구 및 안정성 (Fallback Mechanism)
- 외부 API 장애 발생 시 시스템의 중단 없는 운영을 위해 **고정 환율(Fallback rate: 1,510.5)**을 적용하도록 설계되었습니다.
- JUnit 테스트(`MarketDataServiceTest.java`)를 통한 Mock 응답 및 실제 API 연결 상태를 검증 완료했습니다.

## 3. 프론트엔드: 통화 로컬라이제이션 통합 (Localization Unification)

### 3.1 `formatCurrency` 유틸리티 고도화
기존의 단순 포맷터를 확장하여 수치 규모(Scale)에 따른 단위(Billion/Million vs 조/억) 자동 환산을 지원합니다.

- **단위 환산 로직**:
    - **USD (en)**: `$22.5B`, `$15.0M` 등 영문 축약 기호 사용.
    - **KRW (ko)**: 
        - `B` (10억 달러) → **조(兆)** 단위 환산 (환율 반영).
        - `M` (100만 달러) → **억(億)** 단위 환산.
- **예시 (환율 1,510.5 기준)**:
    - `formatCurrency(4.2, 'B')` → `₩6.34조`
    - `formatCurrency(100, 'M')` → `₩1,510.5억`

### 3.2 글로벌 UI 전수 로컬라이징
- **대상 컴포넌트**: `DealFleetOverview`, `GlobalRiskMonitor`, `HedgingAdvisorPanel`, `PfDashboard`, `AIPortfolioOptimizer` 등 주요 대시보드.
- **언어 번역**: `translations.js`를 통해 기술적 라벨(Global Command Center, Live Data Tunnel 등)을 한국어 표준 용어로 완전 번역했습니다.
- **플레이스홀더 지원**: `t()` 함수를 개선하여 `{{level}}`과 같은 동적 변수를 포함한 문장 번역이 가능하도록 최적화했습니다.

## 4. 결론 (Conclusion)

Phase 18을 통해 IB 플랫폼은 단순히 정적인 UI를 넘어, 실시간 금융 시장의 변동성을 반영하고 전 세계 자산의 가치를 각 지역별(KRW/USD) 최적화된 단위로 정확하게 시각화하는 기술적 완성도를 갖추게 되었습니다.

---
> Last Updated: 2026-04-03 | Status: ✅ VERIFIED
