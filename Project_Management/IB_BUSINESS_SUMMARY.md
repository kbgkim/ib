# [IB-BUS-MAP] 통합 IB 비즈니스 업무 요약 가이드 (v1.0)

여러 기술 설계서와 드래프트 사이에서 현재 우리가 구축 중인 **IB(Investment Banking) 업무의 핵심 로직**을 한눈에 파악하기 위한 비즈니스 요약본입니다.

---

## 🧭 업무의 큰 그림 (The Integrated Scope)

우리는 **M&A 자문, 프로젝트 파이낸싱(PF), 자본시장(ECM/DCM)**의 파편화된 업무를 하나의 **통합 플랫폼**으로 묶고 있습니다.

- **M&A**: 기업 인수합병 시 시너지 분석 및 보안 문서(VDR) 관리.
- **PF**: 프로젝트의 현금흐름(Waterfall) 분석 및 상환 능력 지표(DSCR 등) 관리.
- **ECM/DCM**: IPO, 유상증권 발행 등의 가격 결정 및 수요 예측 지원.

---

## 🔄 통합 업무 생애주기 (Unified Lifecycle)

모든 IB 상품은 다음의 표준화된 6단계 비즈니스 흐름을 따릅니다.

1.  **Mandate (제안 및 수임)**: 딜 목표 설정 및 고객 수임.
2.  **DD & VDR (실사)**: 가상 데이터룸을 통한 정밀 실사 및 기밀 데이터 수집.
3.  **Valuation (가치 평가)**: DCF, Comps 등을 활용한 프로젝트/기업 가치 산정.
4.  **Risk & Sim (리스크 및 시나리오)**: 
    - 통합 스코어링 엔진을 통한 리스크 산출.
    - **[What-if]**: 조달 금리 1% 상승 시 수익성 변화 시뮬레이션.
5.  **Audit (심사 및 승인)**:
    - **[HITL]**: AI 점수가 모호한 구간(Gray Zone)은 반드시 심사역의 최종 검토를 거침.
6.  **Closing (종결)**: 최종 가격 결정 및 딜 실행.

---

## 🧮 핵심 비즈니스 로직 (Core Business Rules)

### ① PF 현금흐름 Waterfall
- 수익 발생 시 **운영비 → 세금 → 선순위 부채 → 예비비 → 주주 배당** 순으로 지급하는 엄격한 우선순위 규칙.

### ② 리스크 지표 (Coverage Metrics)
- **DSCR**: 당기 원리금 상환 능력.
- **LLCR/PLCR**: 프로젝트 전체 생애주기에 걸친 상환 복원력 측정.

### ③ 설명 가능한 AI (Explainable AI - SHAP)
- 단순한 '위험/안전' 결과가 아닌, **어떤 팩터(주가 변동, 부채 비율 등)**가 리스크에 얼마나 영향을 주었는지를 설명.

---

## 📁 업무 내용을 찾으실 때 참고할 파일

- **업무 프로세스 및 도메인 개요**: [IB_Domain_Standard.md](file:///home/kbgkim/antigravity/projects/ib-risk-worktree/Formal_Specs/01_Market_Domain/IB_Domain_Standard.md)
- **금융/재무 공식 및 알고리즘**: [PF_CashFlow_Financial_Spec.md](file:///home/kbgkim/antigravity/projects/ib-risk-worktree/Formal_Specs/02_Product_Structures/PF_CashFlow_Financial_Spec.md)
- **기술적 통합 아키텍처**: [아키텍처 사양서.md](file:///home/kbgkim/antigravity/projects/ib-risk-worktree/inbox/%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%20%EC%82%AC%EC%96%91%EC%84%9C.md)

---

> [!TIP]
> **"우리는 지금 업무를 디지털로 복제하고 있습니다."**
> 복잡한 기술 용어는 잊으시고, 위 파일들이 실제 IB 현업의 **'업무 규칙'**을 충실히 담고 있는지를 검토해 주시면 됩니다.
