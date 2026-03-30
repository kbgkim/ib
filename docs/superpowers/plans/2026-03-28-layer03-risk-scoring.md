# [Layer 03: Risk] 통합 리스크 스코어링 구현 계획 (Detailed)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ECM/DCM/PF/M&A의 복합 리스크를 0-100 점수로 산출하고 이를 5단계 등급(AAA~D)으로 변환하는 통합 리스크 엔진을 구축합니다.

**Architecture:** 4대 리스크 카테고리(Financial, Legal, Operational, Security)별 가중치 합산 방식의 `RiskCompositeEngine`을 개발하며, 외부 ML 예측값은 `RiskMLAdapter`를 통해 통합 점수에 반영합니다.

**Tech Stack:** Java 17, Spring Boot 3.x, JPA/PostgreSQL 14, gRPC, JUnit 5.

---

### Task 1: 데이터베이스 스키마 정의 (PostgreSQL 14)

**Files:**
- Create: `src/main/resources/db/migration/V3__Create_Risk_Tables.sql`

- [ ] **Step 1: 통합 리스크 마스터 및 상세 테이블 DDL 작성**

```sql
-- 리스크 마스터 테이블
CREATE TABLE T_IB_RISK_MASTER (
    DEAL_ID VARCHAR(20) PRIMARY KEY,
    TOTAL_SCORE NUMERIC(5, 2),
    FINAL_GRADE VARCHAR(5),
    LAST_UPDATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 리스크 상세 팩터 테이블
CREATE TABLE T_IB_RISK_DETAIL (
    DETAIL_ID SERIAL PRIMARY KEY,
    DEAL_ID VARCHAR(20),
    CATEGORY VARCHAR(20), -- FINANCIAL, LEGAL, OPS, SECURITY
    FACTOR_NAME VARCHAR(50),
    RAW_VALUE NUMERIC,
    WEIGHTED_SCORE NUMERIC(5, 2),
    CONSTRAINT FK_RISK_MASTER FOREIGN KEY (DEAL_ID) REFERENCES T_IB_RISK_MASTER(DEAL_ID)
);
```

- [ ] **Step 2: DDL 실행 및 테이블 생성 확인**

Run: `psql -U user -d db -f src/main/resources/db/migration/V3__Create_Risk_Tables.sql`
Expected: "CREATE TABLE" x 2

---

### Task 2: Risk Scoring 모델 및 매퍼 구현

**Files:**
- Create: `src/main/java/com/ib/risk/domain/RiskGrade.java`
- Create: `src/main/java/com/ib/risk/util/RiskGradeMapper.java`
- Test: `src/test/java/com/ib/risk/util/RiskGradeMapperTest.java`

- [ ] **Step 1: 점수->등급 매핑 로직 실패 테스트 작성**

```java
@Test
void shouldMapScoreToGrade() {
    assertEquals("AAA", RiskGradeMapper.toGrade(95.0));
    assertEquals("D", RiskGradeMapper.toGrade(20.0));
}
```

- [ ] **Step 2: 실패 확인 (Compilation Error / Test Fail)**

- [ ] **Step 3: RiskGrade 열거형 및 매퍼 구현**

```java
public enum RiskGrade {
    AAA(90, 100), AA(80, 89), A(70, 79), B(50, 69), D(0, 49);
    // ... logic ...
}
```

- [ ] **Step 4: 테스트 통과 확인 및 커밋**

---

### Task 3: integrated Risk Composite 엔진 구현 (TDD)

**Files:**
- Create: `src/main/java/com/ib/risk/service/RiskCompositeEngine.java`
- Test: `src/test/java/com/ib/risk/service/RiskCompositeEngineTest.java`

- [ ] **Step 1: 가중치 합산 로직 실패 테스트 작성 (RED)**

```java
@Test
void shouldCalculateTotalScoreWithWeights() {
    RiskData data = new RiskData(80, 70, 90, 60); // Fin, Leg, Ops, Sec
    double total = engine.calculate(data);
    assertEquals(75.5, total); // 예시 가중치 반영 결과
}
```

- [ ] **Step 2: 최소 기능 구현으로 테스트 통과 (GREEN)**

- [ ] **Step 3: 리팩토링 및 커밋 (REFACTOR)**

---

### Task 4: 외부 ML & VDR 어댑터 인터페이스 정의

**Files:**
- Create: `src/main/java/com/ib/risk/integration/MLClient.java` (Interface)
- Create: `src/main/java/com/ib/risk/integration/VDRAnalyzer.java` (Interface)

- [ ] **Step 1: 외부 연동을 위한 인터페이스 및 Mock 객체 생성**

- [ ] **Step 2: 통합 엔진에서 어댑터 호출 로직 추가 및 테스트**

---

### Task 5: 통합 리스크 평가 API 컨트롤러 개발

**Files:**
- Create: `src/main/java/com/ib/risk/web/RiskController.java`
- Test: `src/test/java/com/ib/risk/web/RiskControllerTest.java`

- [ ] **Step 1: POST /api/v1/risk/evaluate 엔드포인트 구현 및 연동 테스트**

---

### 최종 리뷰 및 머지 (Superpowers/Review)

- [ ] **전체 테스트 슈트 실행 및 결과 검증**
- [ ] **feature/layer03-risk 브랜치 완료 및 메인 브랜치 머지 준비**
