# IB 프로젝트 개발 및 문서화 프로토콜 (v1.0)

본 문서는 안티그래비티(Antigravity)와 사용자 간의 협업 효율성을 극대화하기 위해, 프로젝트 소스 내부에 구현 상세와 진행 상황을 기록하는 표준 규칙을 정의합니다.

## 1. 구현 상세 기록 규칙 (Detailed Recording)

> [!IMPORTANT]
> **단일 진실 공급원 (Single Source of Truth)**: 모든 기술적 의사결정, API 사양, DB 스키마 변경, 로직 상세 구현 내역은 브레인(Brain) 아티팩트뿐만 아니라 프로젝트 폴더 내부의 `Project_Management/implementation_plan.md`에 반드시 병행 기록합니다.

- **대상 파일**: `/home/kbgkim/antigravity/projects/ib/Project_Management/implementation_plan.md`
- **기록 시점**: 
    - 새로운 기능 구현(Phase) 착수 전 (계획)
    - 구현 완료 후 (최종 결과 및 기술 사양)
- **필수 포함 항목**:
    - **기술 사양**: 사용된 라이브러리, 알고리즘, 물리적 파일 변경점.
    - **데이터 모델**: 신규 테이블 스키마, 필드 속성, JSON 직렬화 구조 등.
    - **비즈니스 로직**: 핵심 계산 함수(예: DSCR 산식)의 구현 상세.

## 2. 작업 일지 및 현황 관리 (Progress Tracking)

- **데일리 로그**: `/home/kbgkim/antigravity/projects/ib/logs/[Year]/[Month]/[Day]/action_log.md`
    - 각 작업 세션의 타임스탬프와 주요 구현 사항을 3~5줄 내외로 요약 기록합니다.
- **컨텍스트 업데이트**: `/home/kbgkim/antigravity/projects/ib/Project_Management/PROJECT_CONTEXT.md`
    - 전체 버전(vX.X) 및 개발 로드맵(Phase 체크리스트)을 세션 마감 시 최신 상태로 유지합니다.

## 3. 세션 마감 절차 (Session Closing)

1.  **코드 동기화**: 모든 작업물을 `master` 브랜치에 반영.
2.  **문서 동기화**: 브레인의 `implementation_plan`과 `walkthrough`의 핵심 기술 내용을 프로젝트 측 `implementation_plan.md`로 전이.
3.  **복구 명령 갱신**: `PROJECT_CONTEXT.md`의 최하단 "Restore Command"를 차기 작업에 맞게 수정.

---
**이 규칙은 2026-03-31 v2.0 통합 완료 시점부터 강제 적용됩니다.**
