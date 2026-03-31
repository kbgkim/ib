# IB 플랫폼 운영 가이드 (Operations Guide)

이 문서는 IB 통합 플랫폼의 백엔드 엔진, 프론트엔드 대시보드, 그리고 ML 예측 엔진을 구동, 종료, 관리하는 방법을 설명합니다.

---

## 1. 프로젝트 환경 설정 (Environment Setup)

프로젝트 전용 환경 변수와 편리한 관리 명령(Alias)을 사용하기 위해 다음 설정을 권장합니다.

### 1.1 환경 로드
터미널 접속 시 또는 처음 시작할 때 `aib` 명령을 실행합니다.

```bash
# IB 환경 활성화 Alias
aib  # 또는 source /home/kbgkim/antigravity/projects/ib/bin/ib_env
```

---

## 2. 권장: 자동화 명령 (Automated Management)

환경이 로드된 상태(`aib`)에서 아래의 단축 명령어를 사용하여 서비스를 통합 관리할 수 있습니다.

| 설명 | 전체 명령어 | 단축어 (Shorthand) |
| :--- | :--- | :--- |
| **서비스 통합 시작** | `irun a` | `ir` |
| **서비스 통합 종료** | `istop a` | `is` |
| **현재 상태 확인** | `ists` | `ist` |
| **로그 실시간 확인** | `ilog a` | `il` |
| **프로젝트 홈 이동** | `ib` | - |
| **로그 디렉토리 이동** | `ilogs` | - |

### 개별 서비스 관리
- **백엔드 (M&A)**: `irunb`, `istopb`, `ilogb`
- **PF 엔진 (Finance)**: `irunp`, `istopp`, `ilogp`, `istsp`
- **ML 엔진 (Python)**: `irunm`, `istopm`, `ilogm`, `istsm`
- **프론트엔드 (React)**: `irunf`, `istopf`, `ilogf`, `istsf`

---

## 3. 서비스 구성 요소 및 수동 실행 (Manual Execution)

### 3.1 백엔드 (M&A Valuation Engine)
- **기술 스택**: Java 17 / Spring Boot
- **포트**: `8080`
- **실행**: `./gradlew :ib-mna-engine:bootRun`

### 3.2 PF 엔진 (Project Finance Engine)
- **기술 스택**: Java 17 / Spring Boot
- **포트**: `8082`
- **실행**: `./gradlew :ib-pf-engine:bootRun`

### 3.3 ML 엔진 (Risk Prediction Engine)
- **기술 스택**: Python 3 / FastAPI
- **포트**: `8000`
- **실행**: `source venv/bin/activate && uvicorn app.main:app --port 8000`

### 3.4 프론트엔드 (Integrated Dashboard)
- **기술 스택**: React / Vite
- **포트**: `3000`
- **실행**: `npm run dev -- --port 3000`

---

## 4. 주요 기능 가이드 (Feature Guide - v2.0)

### 4.1 시나리오 관리 (Scenario Snapshot)
- **저장**: PF 대시보드 상단의 '시나리오 저장' 버튼을 통해 현재 파라미터와 결과 메트릭을 스냅샷으로 기록합니다.
- **로드**: '최근 저장된 시나리오' 목록에서 '로드' 버튼을 클릭하여 즉각적으로 과거 시뮬레이션 상태를 복원합니다.

### 4.2 자동화 리포트 (PDF Export)
- **기능**: PF 대시보드의 '리포트 PDF' 버튼을 클릭하면 `OpenPDF` 엔진을 통해 전문적인 분석 리포트가 생성됩니다.
- **포함 내용**: 프로젝트 개요, 핵심 커버리지 지표(DSCR, LLCR, PLCR), 요약 평가 의견.

### 4.3 실시간 VDR 리스크 모니터링
- **연동**: `ib-mna-engine`의 `VdrLogProcessor`가 문서 접근 로그를 분석하여 실시간 보안 점수를 산출합니다.
- **경고**: 최소 DSCR이 임계치(1.15x) 이하로 떨어질 경우 대시보드 상단에 **Covenant Breach Warning** 배너가 자동 표시됩니다.

---

## 5. 트러블슈팅 (Troubleshooting)

### 4.1 포트 충돌 발생 시
특정 포트가 이미 사용 중인 경우 해당 단축어(`is`)로 종료하거나 아래 명령을 사용하세요.
```bash
fuser -k 8080/tcp  # M&A Backend
fuser -k 8082/tcp  # PF Engine
fuser -k 8000/tcp  # ML Engine
fuser -k 3000/tcp  # Frontend
```

### 4.2 ML 엔진 `venv` 관련
ML 엔진 구동 시 가상환경이 활성화되어야 합니다. `ib-ml-engine` 디렉토리에 `venv`가 존재하는지 확인하세요.

---

## 5. 저장소 및 브랜치 관리 (Repository & Branch Policy)

### 5.1 브랜치 운영 원칙
현재 저장소는 `master`와 `main` 두 개의 메인 브랜치를 운용하고 있습니다.
*   **`master`**: 관습적인 기본 브랜치로, 현재 최신 소스코드가 유지됩니다.
*   **`main`**: 최신 표준을 따르는 브랜치로, `master`와 동일한 상태를 유지합니다.
*   **작업 브랜치**: 신규 기능 개발 시 `feature/[기능명]` 형식으로 생성하여 작업 후 메인 브랜치로 병합합니다.

### 5.2 네트워크 분리 상황에서의 동기화 (Split-Brain Sync)
프로젝트 환경에 따라 `github.com` 도메인이 실제 외부 GitHub 서버가 아닌 **내부망 Git 서버**를 가리키고 있을 수 있습니다.
*   **현상**: 에이전트(외부망)의 푸시 결과가 사용자 터미널(내부망)이나 웹사이트에서 보이지 않는 경우.
*   **해결**: 에이전트 작업 완료 후, 내부망 터미널에서 **`ibp`** 명령어를 사용하여 최종 동기화를 수행합니다.

### 5.3 브랜치 자동 동기화 및 단축어 (ibp)
번거로운 이중 푸시 작업을 줄이기 위해 **Git Refspec**을 활용한 자동화 설정이 적용되어 있습니다.

*   **자동 동기화 작동 원리**: 
    - 로컬의 `master` 브랜치를 푸시할 때, 서버의 `master`와 `main` 브랜치가 **동시에 업데이트**되도록 구성되어 있습니다.
    - 설정 확인 명령어: `git remote show origin`
    - 기대 출력:
        ```text
        Local refs configured for 'git push':
          master pushes to main   (up to date)
          master pushes to master (up to date)
        ```
*   **단축 명령어 (`ibp`)**: `git push origin master`의 래퍼(Wrapper) 명령어로, `source bin/ib_env` 로드 시 사용 가능합니다.
    ```bash
    ibp          # 기본 푸시 (동축 동기화 수행)
    ibp --force  # 강제 푸시 (동기화 불일치 해결 시)
    ```

### 5.4 워크트리(Worktree) 관리
중복된 작업 환경으로 인한 혼란을 방지하기 위해 **단일 워크트리** 사용을 권장합니다.
*   **권장 경로**: `~/antigravity/projects/ib`
*   **목록 확인**: `git worktree list`
*   **정리**: 불필요한 워크트리는 `git worktree remove [경로] --force`로 삭제하여 환경을 단순하게 유지하십시오.

---

## 6. 프로젝트 관리 문서 (Management Docs)
- **[PROJECT_CONTEXT.md](file:///home/kbgkim/antigravity/projects/ib/Project_Management/PROJECT_CONTEXT.md)**: 전체 상태 및 로드맵 (v2.0)
- **[action_log.md](file:///home/kbgkim/antigravity/projects/ib/logs/2026/03/31/action_log.md)**: 상세 구현 내역 및 데일리 기록
- **[Formal_Specs/](file:///home/kbgkim/antigravity/projects/ib/Formal_Specs/)**: 비즈니스 로직 및 도메인 사양서

