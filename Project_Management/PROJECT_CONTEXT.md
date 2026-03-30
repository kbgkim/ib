# [Context] IB 프로젝트 최종 작업 문맥 및 세션 복구 가이드 (v1.2)

본 문서는 안티그래비티(Antigravity) 세션을 종료하고 나중에 다시 시작할 때, 최신 통합 아키텍처와 정제된 작업 상태를 즉시 복구하기 위한 **최종 마감 메모리** 문서입니다.

---

## Project Context: IB Platform Integration (v1.2) - M&A Simulator Implementation Completed
Last Updated: 2026-03-30
Status: REPOSITORY UNIFIED / FLOW OPTIMIZED
Current Version: v1.3

## 1. 프로젝트 아키텍처 및 핵심 결정 (Core Decisions)

- **저장소 단일화 (Repository Unification)**: 파편화된 4개의 워크트리를 `~/antigravity/projects/ib`로 통합 완료.
- **푸시 자동화 (Multi-Refspec Push)**: `git push origin master` 한 번으로 리모트의 `master`와 `main`이 동시 업데이트되도록 설정 완료 (`git remote show origin`으로 확인 가능).
- **IB 전용 단축어 (`ibp`)**: `git push origin master`의 래퍼(Wrapper) 앨리어스 도입 완료.
- **네트워크 식별**: 내부망 전용 Git 서버(`20.200.245.247`)와의 통신 상태 정기 점검 필요.
- **모듈 구조**: `ib-mna-engine`, `ib-ui-web`, `ib-ml-engine` 멀티 모듈 체계 유지.
- **작업 관리**: 모든 최신 작업물을 `master` 브랜치로 병합 및 강제 추적(`git add -f bin/`) 완료.

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
*   **Layer 04 - M&A Scenario Simulator**: Implementation completed (Backend Multiplier support + Frontend Floating Bar Waterfall Chart).
*   **Operations Guide**: Created [OPERATIONS.md](file:///home/kbgkim/antigravity/projects/ib/OPERATIONS.md) for service management.

---

## 4. 세션 재개 시 다음 작업 (Next Steps)

1. **[M&A Scenario Simulator]**: Base/Bear/Bull 케이스별 가중치 조절 및 Waterfall 차트의 동적 시뮬레이션 로직 강화.
2. **[ML Evolution]**: `ib-ml-engine`에 실제 예측 모델 탑재 및 서빙 인터페이스 고도화.
3. **[E2E Validation]**: 실제 딜 거래(DEAL-001) 기반의 전체 프로세스(실사→리스크분석→밸류에이션) 통합 테스트 수행.

---

## 5. 즉시 복구 명령 (Restore Command)

다음 세션 시작 시 AI에게 이 문장을 입력하십시오:
> "`/home/kbgkim/antigravity/projects/ib/Project_Management/PROJECT_CONTEXT.md` 파일을 읽고 현재 `master` 브랜치 상태에서 작업을 시작해줘. `ibp` 단축어를 사용하여 서버 동기화를 유지하며 M&A 시나리오 시뮬레이터 고도화를 이어가자."
