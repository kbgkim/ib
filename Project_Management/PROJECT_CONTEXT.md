# [Context] IB 프로젝트 최종 작업 문맥 및 세션 복구 가이드 (PROJECT_CONTEXT.md)

이 문서는 안티그래비티(Antigravity) 세션을 종료하고 나중에 다시 시작할 때, 최신 통합 아키텍처와 정제된 작업 상태를 즉시 복구하기 위한 **최종 마감 메모리** 문서입니다.

---

## 1. 프로젝트 목표 및 통합 전략 (Unified Strategy)

- **최종 목표**: IB 플랫폼을 기반으로 **M&A 자문, ECM/DCM, PF**를 통합한 엔터프라이즈급 금융 시스템 사양 구축.
- **핵심 아키텍처 결정 사항 (Core Decisions)**:
    - **통합 플랫폼**: IB(자본시장)를 기본 프레임워크로 하고, M&A와 PF를 전문 서비스 레이어로 통합.
    - **ML 마이크로서비스**: 레이어 04(모델)를 독립된 **'외부 마이크로서비스'**로 분리하여 gRPC/REST 통신.
    - **데이터 독립성(Feature Store)**: ML 서비스 내부에 독립적인 **피처 스토어**를 구축하여 예측의 일관성과 감사(Audit) 가용성 확보.
    - **보안(VDR)**: M&A 및 PF의 민감 문서 관리를 위한 **VDR(Virtual Data Room) API 연동** 설계 반영.
    - **글로벌 오케스트레이션**: `~/.agents/` 기반 Superpowers + GStack + BKit 3계층 구조 및 명령어 자동화 적용.
    - **기본 페이즈**: Superpowers/Brainstorm (별도 명령어 없을 시 기본 적용).

---

## 2. 최신 디렉토리 구조 및 관리 현황 (Directory Map)

- **`Research/`**: 산업 표준 지표(DSCR, LLCR) 및 글로벌 M&A 실무 연구 데이터 보관.
- **`Formal_Specs/`**: 정제된 정규 사양서(v1.0).
- **`Project_Management/`**: 
    - **[Draft_Purification_Map.md](file:///home/kbgkim/antigravity/projects/ib/Project_Management/Draft_Purification_Map.md)**: 초안 -> 정규 사양서 이식 매핑 로드맵.
    - **[implementation_plan.md](file:///home/kbgkim/.gemini/antigravity/brain/eddece91-5d58-430f-8aff-83f1bb096410/artifacts/implementation_plan.md)**: 현재 진행 중인 통합 고도화 계획.
- **`logs/`**: 일자별(`YYYY/MM/DD/`) 작업 로그 저장소 (state_log.md, interaction_log.md).
- **`.gitignore`**: 루트 및 모듈별(ib-ui-web, ib-ml-engine) 독립적/계층적 무시 패턴 적용 (2026-03-30 최적화 완료).

---

## 3. 작업 진행 상태 요약 (Current Status)

- [x] **1단계: 통합 아키텍처 및 매핑 완료 (2026-03-28)**
    - M&A 자문 도메인 통합 및 VDR 보안 연동 설계 원칙 확정.
    - 외부 ML 마이크로서비스 및 독립 피처 스토어 구조 채택.
    - **글로벌 3계층 통합 플러그인 및 자동화 로그 시스템 설치 완료.**
- [x] **2단계: 레포지토리 위생 및 .gitignore 최적화 완료 (2026-03-30)**
    - 루트 `.gitignore` 신규 생성 및 모듈별(Java, Python, React) 패턴 통합.
    - 이미 커밋되었던 빌드 아티팩트(`build/`, `.gradle/`, `.class` 등) 87개 파일 인덱스 제거 완료.

---

## 4. 세션 재개 시 다음 작업 (Next Steps)

1. **[Method B - Layer 03: Risk]**: `/design` 명령으로 통합 리스크 스코어링 사양서 작성 (M&A 실사 포함).
2. **[ML & Data]**: 독립 피처 스토어 상세 설계 및 ML 서비스 API 스펙 확정.
3. **[M&A Security]**: VDR API 연동 및 문서 보안 거버넌스 사양 작성.

---

## 5. 즉시 복구 명령 (Restore Command)

다음 세션 시작 시 AI에게 이 문장을 입력하십시오:
> "`/home/kbgkim/antigravity/projects/ib/Project_Management/PROJECT_CONTEXT.md` 파일을 읽고 글로벌 3계층 오케스트레이터 및 로그 시스템을 활성화하여 작업을 시작해줘."

---

## 6. 비정상 종료 대응 가이드 (Crash Recovery Guide)

시스템 크래쉬나 세션 비정상 종료 발생 시, 다음 절차를 통해 작업 상태를 100% 복구하십시오.

1. **AI 컨텍스트 복원 (Context Recovery)**: 
    - `~/.gemini/antigravity/brain/` 디렉토리 내 가장 최신 세션의 `task.md` 및 `walkthrough.md`를 읽어 마지막 성공 단계와 중단 지점을 확인합니다.
2. **코드 무결성 점검 (File Integrity)**:
    - `git status` 및 `git diff`를 실행하여 커밋되지 않은 코드의 유실이나 불완전한 수정사항이 있는지 체크합니다.
3. **인프라 및 서비스 재기동 (Service Restart)**:
    - **DB**: `pg_isready`로 PostgreSQL 상태를 확인합니다.
    - **Backend**: `export JAVA_HOME=...` 후 `./gradlew :ib-mna-engine:bootRun` 실행.
    - **Frontend**: `ib-ui-web` 디렉토리에서 `npm run dev` 실행.
4. **연동 검증 (Verification)**:
    - `ss -tupln`으로 8080(백엔드), 5173(프론트엔드) 포트 리스닝 확인.
    - `curl -I http://localhost:5173` 등으로 최종 응답 확인 후 작업을 재개합니다.

---
