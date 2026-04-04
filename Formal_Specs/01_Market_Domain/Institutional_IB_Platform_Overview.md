---
ID: IB-DOC-C06
Title: 실제 운영 가능한 IB 플랫폼 개요 / Production-Ready IB Platform Overview
Category: Concept
Version: 1.2
Status: Formalized
---

# [IB-DOC-C06] 실제 운영 가능한 IB 플랫폼 개요

본 문서는 단순 이론을 넘어 실무 증권사의 운영 환경에 적합한 통합 IB 플랫폼의 핵심 운영 철학과 기술적 지향점을 정의합니다.

---

## 1. 운영 철학 (Fundamental Philosophy)

- **Audit & Consistency**: 모든 데이터 변화는 이력(Event)으로 관리되어 사후 검증이 가능해야 함.
- **Real-time State**: 딜러는 "지금 이 순간"의 시장 수요와 리스크를 즉각적으로 파악할 수 있어야 함.
- **Decision Support**: 시스템은 단순 저장을 넘어, AI와 시뮬레이션을 통해 최적의 의사결정 대안을 제시해야 함.

---

## 2. 주요 거버넌스 및 연동

- **Core DB 연동**: 레거시 Oracle 9i 환경에서도 성능 저하 없이 대량의 주문을 처리할 수 있는 아키텍처 (CQRS).
- **실시간 리스크 대시보드**: 1분 이내의 지연 없는 리스크 지표 산출 및 WebSocket 푸시.
- **사용자 경험(UX)**: 실제 트레이딩 데스크의 워크플로우를 반영한 효율적인 UI 구조.

---

> [!NOTE]
> 세부 기술 명세는 [IB_Core_Database_Schema.md](../..-risk-worktree/Formal_Specs/00_System_Architecture/IB_Core_Database_Schema.md) 및 [IB_Trader_Dashboard_UX_Spec.md](../..-risk-worktree/Formal_Specs/05_UI_UX_Prototyping/IB_Trader_Dashboard_UX_Spec.md)를 참조하십시오.
