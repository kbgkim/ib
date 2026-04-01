---
ID: IB-DOC-S05
Title: IB 코어 데이터베이스 스키마 / IB Core Database Schema (Oracle 9i Optimized)
Category: Architecture
Version: 1.3
Status: Formalized
---

# [IB-DOC-S05] IB 코어 데이터베이스 스키마

본 사양서는 통합 IB 플랫폼의 영속성 저장소인 **Oracle 9i** 기반의 데이터베이스 스키마와 인덱스 전략을 정의합니다.

---

## 1. 핵심 데이터 모델 (ERD Overview)

### 1.1 Deal & Order
- **DEAL**: 딜 기본 정보 (IPO/DCM/PF).
- **ORDER_BOOK**: 실시간 주문 내역.

### 1.2 Pricing & Allocation
- **PRICE_CURVE**: 가격별 수요 집계 스냅샷.
- **ALLOCATION_DETAIL**: 배정 결과 및 투자자 티어 정보.

### 1.3 PF & Risk (Advanced)
- **PF_TRANCHE**: PF 구조 및 선순위 정보.
- **ABCP_ISSUANCE**: 유동화증권 발행 및 롤오버(Rollover) 관리.
- **RISK_METRICS**: EL, VaR, CVaR 등 상세 리스크 지수.

### 1.4 System Operations
- **MENU_MASTER**: 시스템 메뉴 구성 및 권한 매핑.
- **COMMON_CODE**: 시스템 전역 공통 코드 (신용보강구분, 딜상태 등).

---

## 2. 테이블 정의 (DDL)

### 2.1 DEAL & ABCP
```sql
CREATE TABLE DEAL (
    DEAL_ID        VARCHAR2(20) PRIMARY KEY,
    DEAL_TYPE      VARCHAR2(10), -- IPO / DCM / PF
    TOTAL_AMOUNT   NUMBER,
    STATUS         VARCHAR2(20),
    CREATED_AT     DATE
);

CREATE TABLE ABCP_ISSUANCE (
    ISSUE_ID       VARCHAR2(30) PRIMARY KEY,
    DEAL_ID        VARCHAR2(20),
    ISSUE_AMOUNT   NUMBER,
    MATURITY_DATE  DATE,
    CE_TYPE        VARCHAR2(10), -- CE01(연대보증), CE02(채무인수) 등
    ROLLOVER_COUNT NUMBER DEFAULT 0,
    CONSTRAINT FK_ABCP_DEAL FOREIGN KEY (DEAL_ID) REFERENCES DEAL(DEAL_ID)
);
```

### 2.2 메뉴 및 공통코드 (System Adm)
```sql
CREATE TABLE COMMON_CODE (
    GRP_CODE       VARCHAR2(10),
    DTL_CODE       VARCHAR2(10),
    CODE_NAME      VARCHAR2(100),
    IS_ACTIVE      CHAR(1) DEFAULT 'Y',
    PRIMARY KEY (GRP_CODE, DTL_CODE)
);

CREATE TABLE MENU_MASTER (
    MENU_ID        VARCHAR2(10) PRIMARY KEY,
    PARENT_ID      VARCHAR2(10),
    MENU_NAME      VARCHAR2(100),
    URL            VARCHAR2(255),
    SORT_ORDER     NUMBER,
    IS_USE         CHAR(1) DEFAULT 'Y'
);
```

---

> [!TIP]
> **성능 최적화**: 대량의 주문이 발생하는 ECM 딜의 경우, 실시간 집계는 Redis에서 수행하고 최종 결과만 Oracle로 동기화하는 **CQRS** 패턴을 권장합니다.
