# [Purification Map] 드래프트 정제 및 이식 매핑 테이블 (v1.0)

본 문서는 `Archive_Drafts`에 보관된 초기 개념 문서들이 향후 어떤 정규 사양서(`Formal_Specs`)로 정제되어 이식될지 추적 관리하는 마이그레이션 맵입니다.

---

## 1. 정제 및 이식 매핑 (Migration Mapping)

| 원본 폴더 (Draft Source) | 타겟 사양서 (Formal Specification Target) | 정제 핵심 (Refinement Focus) |
|---|---|---|
| **01_Concepts** | `01_Market_Domain/IB_Domain_Standard.md` | IB 플랫폼 개요, M&A/PF 특화 프로세스 통합 |
| **02_Deal_Structures** | `02_Product_Structures/PF_CashFlow_Financial_Spec.md` | 현금흐름 Waterfall, 시너지(Synergy) 계산 모델 추가 |
| **03_Risk_Monitoring** | `03_Risk_Analysis/Risk_Monitoring_Spec.md` | 통합 리스크 스코어링 로직, 등급 산정 기준 정립 |
| **04_Models_Algorithms**| `04_Logical_Models/Predictive_Logic_Spec.md` | LightGBM/SHAP 기반 부도 예측 및 **외부 ML 서비스 연동 규격** |
| **05_Market_Operations**| `05_Market_Ops/System_Integration_Spec.md` | Book Building, Pricing, **VDR 연동 보안 규격** |

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

- 모든 정제 작업은 본 매핑 테이블의 **'정제 핵심'**을 따라야 합니다.
- 정제가 완료된 드래프트는 본 문서에서 취소선(~~) 처리하여 완료 여부를 추적합니다.
