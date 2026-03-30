# [Context] IB 프로젝트 최종 작업 문맥 및 세션 복구 가이드 (v1.1)

본 문서는 안티그래비티(Antigravity) 세션을 종료하고 나중에 다시 시작할 때, 최신 통합 아키텍처와 정제된 작업 상태를 즉시 복구하기 위한 **최종 마감 메모리** 문서입니다.

---

## 1. 프로젝트 아키텍처 및 핵심 결정 (Core Decisions)

- **공식 Superpowers 통합**: `obra/superpowers`의 12+종 정밀 스킬셋 및 TDD 엔지니어링 워크플로우 전면 도입.
- **기술 스택**: 메인 DB를 **PostgreSQL 14**로 확정. 외부 **ML 마이크로서비스** 및 **독립 피처 스토어** 구조 채택.
- **보안(VDR)**: M&A 실사 문서 분석을 위한 **니어 실시간(Near Real-time) NLP 분석** 및 보안 거버넌스 설계 반영.
- **작업 격리**: `feature/layer03-risk` 전용 **Git Worktree**를 활용한 병렬 개발 환경 구축.

---

## 2. 최신 디렉토리 구조 (Directory Map)

- **`Formal_Specs/`**: 비즈니스 개념 및 프로세스 보강 완료 (v1.1)
    - `01_Market_Domain/`:
        - **[IB_Domain_Standard.md](file:///home/kbgkim/antigravity/projects/ib/Formal_Specs/01_Market_Domain/IB_Domain_Standard.md)** (M&A 통합 도메인 표준)
        - **[Risk_Scoring_Business_Logic.md](file:///home/kbgkim/antigravity/projects/ib/Formal_Specs/01_Market_Domain/Risk_Scoring_Business_Logic.md)** (리스크 산출 비즈니스 로직)
    - `02_Process_Flow/`:
        - **[MA_VDR_Process_Flow.md](file:///home/kbgkim/antigravity/projects/ib/Formal_Specs/02_Process_Flow/MA_VDR_Process_Flow.md)** (VDR 기반 실사 흐름)
        - **[ML_Data_Conceptual_Guide.md](file:///home/kbgkim/antigravity/projects/ib/Formal_Specs/02_Process_Flow/ML_Data_Conceptual_Guide.md)** (ML 데이터 생애주기)
- **`docs/superpowers/plans/`**:
    - **[2026-03-28-layer03-risk-scoring.md](file:///home/kbgkim/antigravity/projects/ib/docs/superpowers/plans/2026-03-28-layer03-risk-scoring.md)**: 리스크 엔진 세부 구현 계획 (Task 1~5).

---

## 3. 작업 진행 상태 (Current Status)

- [x] **공식 Superpowers 스킬셋 및 명령어 설치**
- [x] **IB 프로젝트 Git 초기화 및 feature/layer03-risk 워크트리 생성**
- [x] **비즈니스 도메인 및 프로세스 문서 보강 (한영 병행 표기 적용)**
- [x] **리스크 스코어링 엔진(Layer 03) 기술 설계 및 계획 수립 (PostgreSQL 14 기준)**

---

## 4. 세션 재개 시 다음 작업 (Next Steps)

1. **[PHASE 3 — EXECUTION]**: `2026-03-28-layer03-risk-scoring.md` 계획에 따라 **Task 1: PostgreSQL 14 리스크 마스터 테이블 생성**부터 시작.
2. **[TDD Cycle]**: 리스크 매퍼 및 컴포지트 엔진의 유닛 테스트 작성 및 구현.
3. **[Integrations]**: ML 서비스 gRPC 클라이언트 및 VDR 니어 실시간 분석기 어댑터 개발.

---

## 5. 즉시 복구 명령 (Restore Command)

다음 세션 시작 시 AI에게 이 문장을 입력하십시오:
> "`/home/kbgkim/antigravity/projects/ib/Project_Management/PROJECT_CONTEXT.md` 파일을 읽고 `feature/layer03-risk` 워크트리에서 Layer 03 통합 리스크 엔진 구현(Task 1~5)을 시작해줘."
