---
ID: IB-DOC-S05
Title: IB 코어 데이터베이스 스키마 / IB Core Database Schema (Oracle 9i Optimized)
Category: Architecture
Version: 1.2
Status: Formalized
---

# [IB-DOC-S05] IB 코어 데이터베이스 스키마

본 사양서는 통합 IB 플랫폼의 영속성 저장소인 **Oracle 9i** 기반의 데이터베이스 스키마와 인덱스 전략을 정의합니다.

---

## 1. 핵심 데이터 모델 (ERD Overview)

### 1.1 Deal & Order
- **DEAL**: 딜 기본 정보 (IPO/DCM/PF).
- **ORDER_BOOK**: 실시간 주문 내역.
- **ORDER_EVENT**: 주문 변경 이력 (Event Sourcing).

### 1.2 Pricing & Allocation
- **PRICE_CURVE**: 가격별 수요 집계 스냅샷.
- **ALLOCATION_DETAIL**: 배정 결과 및 투자자 티어 정보.

### 1.3 PF & Risk
- **PF_TRANCHE**: PF 구조 및 선순위 정보.
- **WATERFALL_RESULT**: 기간별 현금흐름 분배 결과.
- **RISK_EXPOSURE**: 투자자 및 딜별 익스포저 관리.

---

## 2. 테이블 정의 (DDL)

### 2.1 DEAL
```sql
CREATE TABLE DEAL (
    DEAL_ID        VARCHAR2(20) PRIMARY KEY,
    DEAL_TYPE      VARCHAR2(10), -- IPO / DCM / PF
    TOTAL_AMOUNT   NUMBER,
    STATUS         VARCHAR2(20),
    CREATED_AT     DATE
);
```

### 2.2 ORDER_BOOK
```sql
CREATE TABLE ORDER_BOOK (
    ORDER_ID       VARCHAR2(30) PRIMARY KEY,
    DEAL_ID        VARCHAR2(20),
    INVESTOR_ID    VARCHAR2(20),
    PRICE          NUMBER,
    AMOUNT         NUMBER,
    STATUS         VARCHAR2(20),
    CREATED_AT     DATE
);

CREATE INDEX IDX_ORDER_DEAL ON ORDER_BOOK(DEAL_ID, PRICE);
```

---

> [!TIP]
> **성능 최적화**: 대량의 주문이 발생하는 ECM 딜의 경우, 실시간 집계는 Redis에서 수행하고 최종 결과만 Oracle로 동기화하는 **CQRS** 패턴을 권장합니다.
