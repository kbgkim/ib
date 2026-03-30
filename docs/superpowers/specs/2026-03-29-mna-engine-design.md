---
ID: IB-SPEC-MNA-01
Title: M&A 시너지 및 가치평가 엔진 상세 설계 / M&A Synergy & Valuation Engine Design Spec
Version: 1.0
Date: 2026-03-29
Status: Draft (Pending Approval)
---

# [IB-SPEC-MNA-01] M&A 시너지 및 가치평가 엔진 상세 설계

본 문서는 통합 IB 플랫폼의 핵심 모듈인 'M&A 시너지 및 가치평가 엔진'의 아키텍처, 데이터 모델, 시나리오 로직을 정의합니다.

---

## 1. 아키텍처 및 기술 스택 (Architecture & Tech Stack)

- **Database**: **PostgreSQL 14+** (Oracle 9i 대신 채택).
    - 복합 재무 데이터를 위한 정규화된 테이블 구조와 시나리오 저장을 위한 **JSONB** 필드 활용.
- **Backend**: Spring Boot 3.x (Java 17+).
- **Frontend**: React 기반의 다이나믹 대시보드 (Chart.js / Highcharts 활용).
- **Logic Engine**: **Hybrid Valuation Engine** (Java 기반의 금융 연산 모듈).

---

## 2. 시너지 산출 모델 (Synergy Modeling)

### 2.1 하이브리드 분류 체계
- **표준 템플릿**: 비용(Cost), 매출(Revenue), 재무(Financial) 시너지 제안.
- **사용자 정의**: 템플릿 외 특수 시나리오 항목 추가 기능 보유.
- **집계**: 모든 하위 항목은 표준 3대 분류로 자동 롤업(Roll-up).

### 2.2 실현 스케줄링 (Timing)
- **마일스톤 연동**: IT 통합, 본사 이전 등 특정 이벤트(Event) 시점에 시너지 실현율(%) 자동 활성화.
- **연간 배분**: 마일스톤 가중치를 적용한 5~10개년 연간 현금흐름(CF) 산출.

---

## 3. 가치평가 방법론 (Valuation Logic)

### 3.1 통합 평가 (Integrated Hybrid)
- **DCF (Discounted Cash Flow)**: 증분 시너지 CF 및 영구가치(TV) 산출.
- **Multiples (Trading Comp)**: EV/EBITDA, P/E 등의 실시간 시장 배수 활용.
- **Weighted Valuation**: DCF 결과와 Multiples 결과에 사용자가 정의한 가중치(예: 6:4)를 부여하여 최종 Target Price 산출.

---

## 4. 데이터 파이프라인 (Data Pipeline)

- **Internal Data**: PostgreSQL 내의 Target 기업 재무 정보 및 DD 결과값 활용.
- **External Data**: 외부 금융 API(KRX, KIND 등)를 통한 Peer 그룹의 실시간 시가총액 및 재무 지표 연동.
- **Override Layer**: 시스템 수집 데이터에 대한 사용자의 수동 보정 기능 제공.

---

## 5. 리포팅 및 UI (Output & UX)

- **Dynamic Dashboard**: 
    - **One-page Summary**: 가치 범위 및 시너지 업사이드 요약.
    - **Waterfall Chart**: 가치 증대 과정 시각화.
    - **Scenario Comparison**: Bear/Base/Bull 시나리오 병렬 비교.
- **Export**: 분석 결과를 PDF 리포트 및 엑셀 모델(Calculation Sheet)로 추출.

---

## 6. 특이사항 및 향후 과제

- **PostgreSQL 최적화**: 대량의 시뮬레이션 데이터 처리를 위한 인덱싱 전략 수립 필요.
- **API 보안**: 외부 금융 데이터 수집 시 API Key 관리 및 Rate Limit 대응 로직 반영.

---
> [!NOTE]
> 본 설계 문서는 2026-03-29 브레인스토밍 세션을 통해 합의된 내용을 바탕으로 작성되었습니다.
