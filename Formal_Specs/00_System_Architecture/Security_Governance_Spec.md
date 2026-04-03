# 시스템 아키텍처: 최적화 및 보안 거버넌스 사양서 (v1.0)

## 1. 개요 (Overview)
본 사양서는 IB 플랫폼의 **Phase 17: 플랫폼 최적화 및 보안 거버넌스** 설계를 정의합니다. 대규모 고액 자산가의 실시간 리스크 시뮬레이션 환경에서 시스템의 응답 성능을 극대화하고, 재무적 영향력이 큰 작업에 대한 보안 감사(Audit) 체계를 구축하는 것을 목표로 합니다.

## 2. 성능 최적화 (Performance Optimization)

### 2.1 Caffeine 캐싱 전략
빈번하게 조회되는 글로벌 자산 정보와 계산 집약적인 리스크 전파 시뮬레이션 결과를 메모리에 캐싱하여 DB 부하를 최소화합니다.
- **Cache Names**: `globalAssets`, `riskPropagation`.
- **Policy**: 
    - `expireAfterWrite`: 1분 (데이터 신선도 유지).
    - `maximumSize`: 1000개 엔트리 (힙 메모리 관리).
- **Implementation**: `com.ib.system.config.CacheConfig`.

## 3. 보안 거버넌스 (Security Governance)

### 3.1 AOP 기반 감사 로깅 (Execution Audit)
재무적 의사결정에 직결되는 주요 비즈니스 메서드 실행을 감시하고 기록합니다.
- **Aspect**: `ExecutionAuditAspect`.
- **Target Points**: 
    - `AutoHedgingService.generateRecommendations()`
    - `AutoHedgingService.executeStrategy()`
- **Logged Content**: 실행 시각, 메서드명, 입력 파라미터(자산 ID, 리스크 점수 등), 실행 결과(추천 전략 리스트).

## 4. 시스템 건전성 모니터링 (System Health)

### 4.1 Health Check API
통합 플랫폼 내부의 각 엔진(M&A, ML, PF, Risk)의 가동 상태를 주기적으로 체크하는 통합 엔드포인트를 제공합니다.
- **Endpoint**: `GET /api/v1/system/health`
- **Response Structure**:
    - `status`: 전체 시스템 상태 (`GREEN`, `AMBER`, `RED`).
    - `activeEngines`: 개별 엔진별 업타임 상태 (`UP`, `DOWN`).
    - `version`: 현재 플랫폼의 최종 프로덕션 버전 정보.

---
**Last Updated**: 2026-04-03 | **Status**: Verified by Implementation
