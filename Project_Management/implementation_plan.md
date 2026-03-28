# [로드맵] IB 문서 고도화 및 시스템 전환 계획 (Korean/English Mix)

본 계획은 현재의 IB(Investment Banking) 문서들을 "정밀화 및 정제(Purification)"하여, 단순한 개념 단계를 넘어 실제 시스템 구축이 가능한 사양서 수준으로 격상시키기 위한 방법론을 제시합니다.

## 사용자 검토 필요 사항 (User Review Required)

> [!IMPORTANT]
> **디렉토리 재구조화**: 기존의 모든 개념 단계 폴더(01~05)를 `Archive_Drafts` 폴더로 이동하여 '초기 구상'과 '정식 사양'을 명확히 분리합니다.

> [!NOTE]
> 모든 신규 문서는 `Formal_Specs` 구조 아래에서 Mermaid 다이어그램 및 AI 생성 이미지를 활용하여 시각적으로 고도화된 상태로 작성됩니다.

---

## 제안하는 디렉토리 구조 (Proposed Structure)

`/home/kbgkim/antigravity/projects/ib/` 폴더 내:

-   **`Research/`**: `PF_Industry_Research.md` 포함 (조사된 지표 및 생애주기 단계 기록).
-   **`Archive_Drafts/`**: 기존 `01_Concepts` ~ `05_Market_Operations` 및 Resource 등 이동 보관.
-   **`Formal_Specs/`**: 정제된 정규 "gstack" 사양서.
    -   `01_Market_Domain/`: 고도화된 비즈니스 개요 및 도메인 맵.
    -   `02_Product_Structures/`: 고도화된 PF 구조 및 상환 Waterfall.
    -   `03_Risk_Metrics/`: 리스크 분석 모델 및 지표.
    -   `04_Logic_Engines/`: 계산 로직 Pseudocode 및 DB 스키마.
-   **`Project_Management/`**: 구현 계획서, 할 일 목록, 결과 보고서(Walkthrough) 통합 관리.

---

## 단계별 실행 계획 (Step-by-Step)

### 1. 연구 결과 문서화 (Research Documentation)
- **[신규] [PF_Industry_Research.md](file:///home/kbgkim/antigravity/projects/ib/Research/PF_Industry_Research.md)**: PF 생애주기, DSCR/LLCR/PLCR 지표 및 Waterfall 우선순위 등 전문 지식 기록.

### 2. 물리적 재구조화 (Physical Restructuring)
- **[이동]**: 기존 모든 디렉토리를 `/ib/Archive_Drafts/`로 이전.
- **[신규]**: `Formal_Specs/` 및 `Project_Management/` 디렉토리 계층 생성.

### 3. 정식 문서 생산 (Formal Production)
- **[신규] [IB_Domain_Standard.md](file:///home/kbgkim/antigravity/projects/ib/Formal_Specs/01_Market_Domain/IB_Domain_Standard.md)**: 첫 번째 정문화된 사양서. 비즈니스 개요, 생애주기 단계, Swimlane 다이어그램 포함.
- **[신규] [PF_CashFlow_Financial_Spec.md](file:///home/kbgkim/antigravity/projects/ib/Formal_Specs/02_Product_Structures/PF_CashFlow_Financial_Spec.md)**: 고급 지표 산식, Waterfall 계층 및 우선순위 시각화.

---

## 확인 질문 (Open Questions)

> [!IMPORTANT]
> 1. **아카이브 명칭**: 현재 초안 파일들을 보관할 폴더명으로 `Archive_Drafts`가 적절합니까?
> 2. **제작 순서**: `01_Market_Domain`을 먼저 완벽히 마무리한 후 다음 단계로 넘어갈까요, 아니면 병렬적으로 구축할까요?
