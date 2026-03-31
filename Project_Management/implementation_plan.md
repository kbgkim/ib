# [구현 보고서] IB 플랫폼 통합 및 고도화 (v2.0)

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

---

## 3. 프론트엔드 및 지능화 (Frontend & Intelligence)

### 3.1 프리미엄 UI 디자인
- **Glassmorphism**: 투명도와 블러 효과를 활용한 레이어드 디자인 시스템.
- **Neon Glow Charts**: Chart.js 기반의 커스텀 스타일링 (Radar, Tornado, Waterfall 차트).
- **Smart Alert**: 최소 DSCR 임계치(1.15x) 하회 시 **Covenant Breach Warning** 배너 자동 상주.

### 3.2 자동 리포트 시스템 (Reporting)
- **Library**: `OpenPDF` (LGPL/MPL) 활용.
- **Output**: 프로젝트 개요, 핵심 지수(Gauges), 민감도 요약 등을 포함한 전문 리스크 리포트(PDF) 자동 생성 API 구축.

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
