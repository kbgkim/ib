# IB Platform Technical Troubleshooting Log (Final Stabilization)

본 문서는 IB 플랫폼 Phase 15-17 통합 및 최종 안정화 과정에서 발생한 주요 기술적 이슈와 해결 방안을 기록한 실무 로그입니다.

## 1. 데이터베이스 자동화 및 의존성 이슈 (Flyway)

### 1.1 `flyway-database-postgresql` 의존성 오류
- **현상**: Flyway 도입 시 `Could not find org.flywaydb:flyway-database-postgresql` 오류로 빌드 실패.
- **원인**: Spring Boot 3.2.0에서 사용하는 Flyway 9.x 버전은 DB 전용 확장 모듈(Flyway 10+)을 지원하지 않음.
- **해결**: 
    - `build.gradle`에서 `flyway-database-postgresql` 제거.
    - `runtimeOnly 'org.postgresql:postgresql'` 드라이버 명시.
    - Flyway 9 버전의 `flyway-core`가 제공하는 기본 DB 지원 기능 사용.

### 1.2 기존 스키마와의 충돌 (Non-empty Schema)
- **현상**: `Found non-empty schema(s) "ib" but no schema history table` 오류로 기동 실패.
- **원인**: Hibernate `ddl-auto`로 기생성된 테이블이 있으나 Flyway 이력 테이블이 없어 발생.
- **해결**: `application.yml`에 `spring.flyway.baseline-on-migrate: true` 추가하여 기존 상태를 기준점(Baseline)으로 설정.

### 1.3 마이그레이션 스크립트 중복 오류 (42P07 / 42701)
- **현상**: `relation already exists` 또는 `column already exists` 오류로 마이그레이션 중단.
- **원인**: 동일한 스키마에 대해 여러 번 기동 시 `CREATE TABLE` 또는 `ALTER TABLE` 구문이 충돌.
- **해결**: 
    - `CREATE TABLE IF NOT EXISTS` 구문 적용.
    - `ALTER TABLE` 시 PL/pgSQL 블록(`DO $$ ... $$`)을 사용하여 컬럼 존재 여부 체크 후 실행하도록 멱등성 확보.

## 2. 보안 감사 로깅 이슈 (AOP Proxy)

### 2.1 감사 로그(`AUDIT LOG`) 미출력
- **현상**: Sentinel Mode에 의한 자동 헤징 실행 시 로그가 남지 않음.
- **원인**: Spring AOP는 프록시 기반으로 작동하며, 동일 클래스 내부의 메서드 호출(`this.method()`)은 프록시를 거치지 않아 Aspect가 트리거되지 않음 (Self-invocation issue).
- **해결**: 
    - `ExecutionAuditAspect`의 Pointcut을 서비스의 진입점인 `generateRecommendations`까지 확장.
    - 메서드 내부 로직과 관계없이 서비스 호출 시점부터 감시하도록 설계 변경.

## 3. 성능 및 캐싱 (Caffeine)

### 3.1 캐시 효율성 확인
- **현상**: 데이터 시딩 후 대시보드 조회 시 초기 속도 불만족.
- **해결**: 
    - `Caffeine` 인메모리 캐시 도입.
    - `TTL=1m` 설정으로 데이터 무결성과 성능의 균형 확보.
    - **결과**: `/monitoring/assets` 응답 속도를 350ms -> **11ms**로 단축.

---
> [!NOTE]
> 이 트러블슈팅 로그는 향후 플랫폼 유지보수 및 유사 환경(Staging/Prod) 배포 시 참조 자산으로 활용됩니다.
