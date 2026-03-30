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
- **백엔드 (Java)**: `irunb`, `istopb`, `ilogb`
- **프론트엔드 (React)**: `irunf`, `istopf`, `ilogf`
- **ML 엔진 (Python)**: `irunm`, `istopm`, `ilogm`, `istsm`

---

## 3. 서비스 구성 요소 및 수동 실행 (Manual Execution)

### 3.1 백엔드 (M&A Valuation Engine)
- **기술 스택**: Java 17 / Spring Boot
- **포트**: `8080`
- **실행**: `./gradlew :ib-mna-engine:bootRun`

### 3.2 ML 엔진 (Risk Prediction Engine)
- **기술 스택**: Python 3 / FastAPI
- **포트**: `8000`
- **실행**: `source venv/bin/activate && uvicorn app.main:app --port 8000`

### 3.3 프론트엔드 (Integrated Dashboard)
- **기술 스택**: React / Vite
- **포트**: `3000`
- **실행**: `npm run dev -- --port 3000`

---

## 4. 트러블슈팅 (Troubleshooting)

### 4.1 포트 충돌 발생 시
특정 포트가 이미 사용 중인 경우 해당 단축어(`is`)로 종료하거나 아래 명령을 사용하세요.
```bash
fuser -k 8080/tcp  # Backend
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
*   **해결**: 에이전트가 로컬 파일 정리를 완료하면, **사용자님께서 직접 내부망 터미널에서 아래 명령어를 실행**하여 최종 동기화를 완료해야 합니다.
    ```bash
    git push origin master --force
    git push origin master:main --force
    ```

### 5.3 워크트리(Worktree) 관리
중복된 작업 환경으로 인한 혼란을 방지하기 위해 **단일 워크트리** 사용을 권장합니다.
*   **권장 경로**: `~/antigravity/projects/ib`
*   **목록 확인**: `git worktree list`
*   **정리**: 불필요한 워크트리는 `git worktree remove [경로] --force`로 삭제하여 환경을 단순하게 유지하십시오.
