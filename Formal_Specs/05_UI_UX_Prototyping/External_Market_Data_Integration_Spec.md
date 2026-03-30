---
ID: IB-DOC-S06
Title: 외부 시장 데이터 연동 사양서 / External Market Data Integration Specification (KRX, KOSCOM)
Category: System / Operation
Version: 1.2
Status: Formalized
---

# [IB-DOC-S06] 외부 시장 데이터 연동 사양서

본 사양서는 **KRX(한국거래소)** 및 **KOSCOM**의 실시간 시세 데이터와 공시 정보를 시스템에 연동하는 방식과 데이터 규격을 정의합니다.

---

## 1. 연동 대상 및 채널 (Data Sources)

- **Koscom Check**: 실시간 주가, 호가, 거래량 데이터 수신.
- **KRX Disclosure (Kind)**: 상장 공시 및 IPO 일정 정보 연동.
- **DART API**: 재무 정보 및 주요 주주 변동 내역 수집.

---

## 2. 데이터 처리 아키텍처

1.  **Ingestion Layer**: 외부 API/Socket을 통해 실시간 스트림 수집.
2.  **Normalization Layer**: 각기 다른 데이터 포맷을 플랫폼 표준 규격으로 변환.
3.  **Real-time Cache (Redis)**: 최신 가격 및 지수 정보를 메모리에 적재하여 대시보드에 즉시 제공.

---

## 3. 활용 시나리오

- **VWAP Pricing**: 실시간 시장 가격(VWAP)과 딜 가이던스 가격의 괴리율 분석.
- **Investor Benchmarking**: 투자자의 타 딜 참여 현황 및 포트폴리오 구성 분석.
- **Automatic Filing**: 공시 데이터를 활용한 딜 마일스톤(Mandate~Closing) 자동 업데이트.

---

> [!IMPORTANT]
> **Data Integrity**: 외부 데이터 연동 중단 시, 시스템은 마지막 수신 데이터를 유지하며 'Delayed' 상태를 표시하는 **Fallback UI**를 가동해야 합니다.
