# [Purification Map] 드래프트 정제 및 이식 매핑 테이블 (v1.0)

본 문서는 `Archive_Drafts`에 보관된 초기 개념 문서들이 향후 어떤 정규 사양서(`Formal_Specs`)로 정제되어 이식될지 추적 관리하는 마이그레이션 맵입니다.

---

## 1. 정제 및 이식 매핑 (Migration Mapping)

| 원본 폴더 (Draft Source) | 타겟 사양서 (Formal Specification Target) | 정제 결과 (Refinement Results) |
|---|---|---|
| ~~**01_Concepts**~~ | `01_Market_Domain/` | **완료**: Lifecycle, BB-Alloc Flow, Game Theory, Auto Strategy |
| ~~**02_Deal_Structures**~~ | `02_Product_Structures/` | **완료**: Waterfall/Tranche Design & Calc Engine, Optimization |
| ~~**03_Risk_Monitoring**~~ | `03_Risk_Engines/` | **완료**: Market Shock, Scenario Engine, Integrated Risk Sim |
| ~~**04_Models_Algorithms**~~| `04_Models_Algorithms/` | **완료**: BB Analysis, Pricing Optimization, ML Pipeline |
| ~~**05_Market_Operations**~~| `05_Market_Ops/` & `00_Arch/` | **완료**: DB Schema, UX Spec, Tiers, Market Data |

---

## 2. 파일별 세부 이식 계획 (Granular Plan)

### Layer 03: Risk (신규 작업 예정)
- **Draft 자료**: `리스크_스코어링_엔진_설계.md`, `실시간_모니터링_대시보드.md` 등
- **정제 방향**: 단순 등급 산정을 넘어선 **'AI 기반 리스크 선제 대응 모드'**를 사양화.

### Layer 04: Models (신규 작업 예정)
- **Draft 자료**: `PF_부도예측_모델_설계.md`, `Hessian_LightGBM_최종가이드.md`, `SHAP 가이드` 등
- **정제 방향**: 알고리즘 설명 위주에서 **'독립 마이크로서비스용 피처 스토어 규격 및 API 스펙'**으로 전환.

### Layer 05: Market Operations (신규 작업 예정)
- **Draft 자료**: `IB_실무_엔진_통합설계.md`, `DCM_BookBuilding_정리.md`, `IPO_공모가_산정_알고리즘.md` 등
- **정제 방향**: 개별 상품의 가격 결정 로직을 **'통합 프라이싱 엔진'**으로 사양화하고, **VDR 보안 권한 매핑** 추가.

---

## 3. 로직 갭 및 보완 사항 (Logic Gaps)

> [!WARNING]
> 현재 `Archive_Drafts`에는 **M&A 시너지(Synergy) 계산 자동화** 및 **VDR API 연동 상세 규격**에 대한 자료가 부족합니다. 이 부분은 제가 리서치한 외부 자료를 적극 활용하여 2단계(Layer 03~05) 작업 시 보완하겠습니다.

---

## 4. 관리 규칙 (Maintenance Rule)

- 모든 정제 작업이 완료되어 `Formal_Specs` 디렉토리에 v1.2 정식 버전이 배포되었습니다. 
- 향후 추가되는 드래프트는 동일한 Staging -> Purification 프로세스를 따릅니다.
