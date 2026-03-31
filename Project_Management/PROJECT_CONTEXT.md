# [Context] IB 프로젝트 최종 작업 문맥 및 세션 복구 가이드 (v3.0)

본 문서는 안티그래비티(Antigravity) 세션을 종료하고 나중에 다시 시작할 때, 최신 통합 아키텍처와 정제된 작업 상태를 즉시 복구하기 위한 **최종 마감 메모리** 문서입니다.

---

## Project Context: IB Platform Integration (v3.0) - Phase 4 COMPLETE
Last Updated: 2026-03-31
Status: FULL STRATEGIC AI ADVISOR & MULTI-DEAL FLEET INTEGRATED
Current Version: v3.0

## 1. 프로젝트 아키텍처 및 핵심 결정 (Core Decisions)

- **저장소 단일화 (Repository Unification)**: 파편화된 4개의 워크트리를 `~/antigravity/projects/ib`로 통합 완료.
- **푸시 자동화 (Multi-Refspec Push)**: `git push origin master` 한 번으로 리모트의 `master`와 `main`이 동시 업데이트되도록 설정 완료 (`git remote show origin`으로 확인 가능).
- **IB 전용 단축어 (`ibp`)**: `git push origin master`의 래퍼(Wrapper) 앨리어스 도입 완료.
- **네트워크 식별**: 내부망 전용 Git 서버(`20.200.245.247`)와의 통신 상태 정기 점검 필요.
- **모듈 구조**: `ib-mna-engine`, `ib-ui-web`, `ib-ml-engine` 멀티 모듈 체계 유지.
- **작업 관리**: 모든 최신 작업물을 `master` 브랜치로 병합 및 강제 추적(`git add -f bin/`) 완료.
- **문서화 표준**: [DEVELOPMENT_PROTOCOL.md](file:///home/kbgkim/antigravity/projects/ib/Project_Management/DEVELOPMENT_PROTOCOL.md)에 따른 기술 상세 및 세션 기록 강제 준수.

---

## 2. 최신 디렉토리 구조 (Directory Map)

- **`ib-mna-engine/`**: 핵심 리스크 엔진 및 서비스 레이어
    - `src/main/resources/db/migration/`: `V3__Create_Risk_Tables.sql`, `V4__Add_Audit_Fields_To_Risk.sql` 등 DB 스키마 완성.
- **`ib-ui-web/`**: 프리미엄 React 대시보드
    - `src/components/`: `RiskEvaluationForm.jsx`, `RiskRadarChart.jsx`, `SynergyInput.jsx`, `ValuationWaterfall.jsx` 등 통합 완료.
- **`Formal_Specs/`**: 비즈니스 개념 및 프로세스 보강 완료 (v1.1)
- **`docs/superpowers/plans/`**:
    - **[2026-03-28-layer03-risk-scoring.md](file:///home/kbgkim/antigravity/projects/ib/docs/superpowers/plans/2026-03-28-layer03-risk-scoring.md)**: 리스크 엔진 구현 계획 (Task 1~5 완료 및 병합).

---

## 3. 작업 진행 상태 (Current Status)

*   **Layer 03 - Risk engine integrated**: Completed & merged to master.
*   **Layer 04 - Interactive Probability Bridge**: Implementation completed.
    - 3-segment weight control with auto-balancing.
    - Real-time weighted average calculation.
    - Sensitivity Range (Error Bar) visualization on Waterfall chart.
*   **ML Evolution**: `ib-ml-engine` professionalized with **LightGBM** (v1.6.1).
    - Transitioned from mock arithmetic to GBDT model.
    - XAI Feature: Top 3 Risk Factors extraction & visualization.
    - Scoring: Internal Risk Probability -> External Safety Score (100-Risk).
*   **Operations Guide**: Created [OPERATIONS.md](file:///home/kbgkim/antigravity/projects/ib/OPERATIONS.md).
*   **Deep Dive Docs**:
    - [Interactive_Probability_Bridge_DeepDive.md](file:///home/kbgkim/antigravity/projects/ib/docs/Interactive_Probability_Bridge_DeepDive.md)
    - [ML_Model_Architecture_Rationale.md](file:///home/kbgkim/antigravity/projects/ib/docs/ML_Model_Architecture_Rationale.md)

---

## 4. 전체 개발 로드맵 (Full Development Roadmap)

> **결정일**: 2026-03-31 | **우선순위 확정**

### ✅ Phase 1, 2 & 3: 플랫폼 통합 및 자동화 완성 (완료)
- **PF/M&A 통합**: `ib-pf-engine`과 `ib-mna-engine`의 UI/UX 단일화 및 기능 통합.
- **시나리오 관리**: 시뮬레이션 결과 영속화(`PostgreSQL`) 및 과거 스냅샷 **로드(State Restore)** 기능 완비.
- **자동화 리포트**: OpenPDF 기반 **전문 리스크 리포트(PDF)** 자동 생성 및 다운로드 기능 구현.
- **VDR 지능화**: 실시간 문서 로그 분석을 통한 동적 리스크 점수 반영.
- **스마트 알림**: 약정(Covenant) 위반 시 자동 경고 배너 및 시각화 반영.

### ✅ Phase 4: AI 전략 제언 및 멀티 딜 확장 (완료)
- **AI 리스크 어드바이저**: 약정 위반 시 대응 전략(Refinancing, Equity Injection 등) 자동 추천 및 시뮬레이션 적용.
- **멀티 딜 대시보드 (Deal Fleet)**: 전사 딜 상태를 한눈에 모니터링하고 개별 프로젝트로 진입하는 총괄 뷰 구현.
- **통합 내비게이션**: Fleet View와 Detail View(M&A/PF) 간의 유기적인 전환 로직 완성.

---

## 5. 즉시 복구 명령 (Restore Command)

다음 세션 시작 시 AI에게 이 문장을 입력하십시오:
> "`/home/kbgkim/antigravity/projects/ib/Project_Management/PROJECT_CONTEXT.md` 파일을 읽고 **Phase 5: VDR NLP 고도화 및 매크로 시나리오 통합** 작업을 준비해줘."
