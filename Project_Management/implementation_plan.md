# [구현 보고서] IB 플랫폼 통합 및 고도화 (v3.0)

본 문서는 초기 구상 단계를 넘어, 실제 구현된 **IB(Investment Banking) 통합 플랫폼(M&A Risk + PF Engine)**의 기술 사양과 상세 구현 내역을 기록한 마스터 보고서입니다.

## 1. 아키텍처 개요 (Architecture Overview)

### 1.1 모듈 구조
- **`ib-mna-engine`**: M&A 가치평가 및 AI 기반 통합 리스크 엔진 (Java/Spring Boot).
- **`ib-pf-engine`**: Project Finance 현금흐름 및 자본구조 시뮬레이션 엔진 (Java/Spring Boot).
- **`ib-ml-engine`**: LightGBM 기반의 리스크 예측 및 XAI 피처 추출 서버 (Python/FastAPI).
- **`ib-ui-web`**: 통합 프리미엄 대시보드 (React/Vite).

---

## 2. 핵심 모듈별 구현 상세 (Implementation Details)

### 2.1 PF(Project Finance) 엔진 (v2.0)
- **자산/부채 모델링**: `PfProject` 엔티티를 통한 총사업비(Capex), 자본구조(Equity/Debt), 운영 파라미터 관리.
- **메트릭 엔진 (`PfMetricsEngine`)**:
    - **DSCR (Debt Service Coverage Ratio)**: 원리금 상환 능력 실시간 산출.
    - **LLCR/PLCR**: 대출 전 기간 및 프로젝트 전 기간 커버리지 지수 계산.
- **Waterfall 로직 (`PfWaterfallEngine`)**: 연도별 매출액에서 OpEx, Tax, Debt Service, DSRA 적립, 배당 순으로 배분되는 현금흐름 시뮬레이션.
- **시나리오 영속화**:
    - `PfScenario` 모델링: 파라미터 및 결과값의 JSON 직렬화 저장 (PostgreSQL).
    - **State Restore**: 저장된 스냅샷 로딩 시 대시보드 상태 즉각 복구 기능.

### 2.2 M&A 리스크 & VDR 엔진 (v2.0)
- **AI 리스크 평가**: LightGBM 모델 연동, Top 3 리스크 요인 추출(XAI) 및 시각화.
- **VDR(Virtual Data Room) 연동**: 
    - `VdrLogProcessor`: 사용자 접근 로그(Anomaly), 민감 문서 노출(Exposure), Q&A 지연율 등을 기반으로 실시간 보안 리스크 점수 산출.
- **통합 가중치 브릿지**: Financial(40%), Legal(20%), Operational(20%), Security(20%)의 동적 가중치 반영 산식.
- **AI VDR Intelligence (v3.0)**:
    - **`VdrController` (M&A)**: `/api/v1/mna/vdr/analyze` 엔드포인트를 통해 실사 문서 NLP 분석 수행.
    - **통합 리스크 조정**: 감성 분석(Sentiment) 및 핵심 리스크 키워드 추출을 통한 리스크 점수(`riskAdjustment`) 자동 산출.

### 2.3 ML 지능형 엔진 (v3.0)
- **NLP 서비스 (`/summarize`)**: FastAPI 기반의 `intelligence.py` 구현. 
- **분석 로직**: Pydantic 모델을 통한 요청/응답 규격화 및 법률/재무 카테고리별 특화 요약 엔진 구축.
- **XAI 연동**: 리스크 요인(Risk Factors) 추출 및 처리 시간 추적.

### 2.4 전략 제언 엔진 (Strategy Advisor)
- **`PfAdvisorService`**: DSCR 임계치 및 LLCR 추세를 기반으로 리파이낸싱(Refinance), 자본확충(Equity Injection), 운영 예비비(DSRA Top-up) 등의 전문 전략 카드 자동 생성.


---

## 3. 프론트엔드 및 지능화 (Frontend & Intelligence)

### 3.1 프리미엄 UI 디자인
- **Glassmorphism**: 투명도와 블러 효과를 활용한 레이어드 디자인 시스템.
- **Neon Glow Charts**: Chart.js 기반의 커스텀 스타일링 (Radar, Tornado, Waterfall 차트).
- **Smart Alert**: 최소 DSCR 임계치(1.15x) 하회 시 **Covenant Breach Warning** 배너 자동 상주.
- **VDR Insight Panel**: AI 실사 분석 결과를 실시간으로 프레젠테이션하는 전용 UI 컴포넌트 통합.


### 3.2 자동 리포트 시스템 (Reporting)
- **Library**: `OpenPDF` (LGPL/MPL) 활용.
- **Output**: 프로젝트 개요, 핵심 지수(Gauges), 민감도 요약 등을 포함한 전문 리스크 리포트(PDF) 자동 생성 API 구축.

### 3.3 스테이홀더 포털 및 라이브 거버넌스 (Phase 13)
- **Technical Scanning Login**: 2.5초간의 보안 스캔 애니메이션(`isScanning`)을 통한 고딕 스타일 보안 관문 구축.
- **Investor Tiering**: `T1(Anchor)`, `T2(Institutional)`, `T3(Retail)` 전용 메탈릭 그라데이션 및 네온 글로우 카드 구현.
- **Premium Notification System**: 브라우저 기본 알림을 대체하는 인-포털 네온 투명 공지 시스템 (`notification` state).
- **Comprehensive Localization (i18n)**:
    - `translations.js` 유틸리티를 통한 한국어/영어 전체 동기화.
    - 화폐 단위(`unit_m`, `unit_b`, `unit_usd`) 및 금융 용어의 동적 번역 체계 구축.
    - 하드코딩된 문자열 전수 제거 및 컴포넌트(`ClientPortal`, `PfDashboard` 등) 전이.

---

## 4. 데이터베이스 스키마 (DB Schema)

| 테이블명 | 용도 | 주요 컬럼 |
| :--- | :--- | :--- |
| `pf_project` | PF 프로젝트 원천 정보 | `projectName`, `totalCapex`, `status` 등 |
| `pf_scenario` | 시뮬레이션 스냅샷 | `parameters`(JSON), `metrics`(JSON), `waterfall_data`(JSON) |
| `risk_master` | M&A 리스크 평가 결과 | `totalScore`, `finalGrade`, `evalComment` |
| `risk_detail` | 항목별 상세 리스크 | `category`, `score`, `weight` |

---

## 5. 최종 결과물 검증 (Verification)
- **시나리오 로드**: 저장된 팩터로의 대시보드 복귀 상태 확인 완료.
- **리포트 출력**: PDF 파일의 시각적 무결성 및 데이터 정확도 확인 완료.
- **통합 엔진**: M&A와 PF 서비스 간 포트 간섭(8080/8082) 없는 동시 구동 확인 완료.
- **AI VDR 연동**: UI -> M&A Controller -> ML Engine으로 이어지는 통합 NLP 분석 파이프라인 검증 완료.

