---
ID: IB-DOC-U01
Title: IB 트레이더 대시보드 UX/UI 사양서 / IB Trader Dashboard UX/UI Specification
Category: UI/UX
Version: 1.2
Status: Formalized
---

# [IB-DOC-U01] IB 트레이더 대시보드 UX/UI 사양서

본 사양서는 트레이더가 실시간으로 딜의 호가 상태와 리스크를 모니터링하고 의사결정을 내릴 수 있는 **대시보드 구현 가이드**를 정의합니다.

---

## 1. 화면 구성 (Layout Overview)

### 1.1 Book Building Screen
- **Price Ladder (호가창)**: 실시간 가격대별 누적 주문량을 시각화.
- **Key Indicators**: 실시간 경쟁률 (Oversubscription), Anchor 참여율 등을 상단에 배치.

### 1.2 Allocation & Risk Screen
- **Investor Grid**: AG Grid와 같은 고성능 그리드를 사용하여 투자자별 티어, 요청 수량, 배정 물량을 실시간 편집.
- **Risk Meter**: 집중도 리스크(Concentration), 가격 안정성 등을 색상 코드(Green/Yellow/Red)로 표시.

---

## 2. UX 핵심 원칙 (Core UX Principles)

- **⚡ 1초의 법칙**: 모든 데이터 변화(주문 유입 등)는 WebSocket을 통해 1초 이내에 화면에 반영되어야 함.
- **⚡ Drill-down**: 대시보드의 특정 수치를 클릭하면 상세 주문 이력(Event Log)으로 즉시 이동 가능해야 함.
- **⚡ Non-blocking**: 대량의 배정 계산 중에도 화면은 멈추지 않고 즉시 응답해야 함.

---

## 3. 기술 스택 (Tech Stack)

- **Frontend**: React + WebSocket API + Highcharts (수요곡선 시각화).
- **Backend**: Spring Boot + Redis Pub/Sub (실시간 이벤트 브로커).
