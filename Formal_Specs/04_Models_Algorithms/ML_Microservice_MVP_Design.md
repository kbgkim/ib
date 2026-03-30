# ML Microservice MVP Design Specification

**Date**: 2026-03-30
**Component**: `ib-ml-engine` (Python FastAPI Microservice)
**Status**: Approved (MVP Design)

---

## 1. 아키텍처 및 시스템 경계 (Architecture & Boundaries)

- **단일 작업 공간 (Monorepo)**: `/projects/ib-risk-worktree/ib-ml-engine/` 폴더 내에 Python 독립 프로젝트를 생성하여 Java 백엔드 및 React 프론트엔드와 동일한 워크트리에서 버전 관리를 수행합니다.
- **독립적 책임**: 
    - `ib-mna-engine` (Java): 리스크 가중치 합산, 비즈니스 평가 워크플로우 통제, Audit 데이터베이스 영속화 역할.
    - `ib-ml-engine` (Python): 과거 데이터(피처) 추출 및 ML 모델을 활용한 순수 리스크 수학적 확률(Predictive Score) 산출 전담.

## 2. Python ML 마이크로서비스 상세

### 기술 스택
- **프레임워크**: Python 3.9+ 기반의 `FastAPI` (고성능 비동기 REST API 프레임워크).
- **의존성 관리**: `pip` 및 `requirements.txt` 사용.

### 피처 스토어 설계 (Feature Store)
- **온라인 피처 스토어 MVP**: 인프라 복잡도를 낮추기 위해 FastAPI 애플리케이션 내부에 Python `dict` 인메모리 구조로 가상의 피처 스토어를 구성합니다. (`deal_id` 기반 O(1) 초고속 조회)
- **미래 확장성 (Future Proof)**: API 인터페이스와 로직 검증이 완료된 이후, `redis` 파이썬 드라이버로 단일 설정값만 변경하여 실제 Redis 인프라로 손쉽게 마이그레이션할 수 있도록 저장소 패턴(Repository Pattern)을 적용합니다.

### 엔드포인트 설계
- **URL 경로**: `/api/v1/ml/predict-risk` (HTTP POST)
- **요청/응답 스펙**: JSON 통신을 기본으로 하며 Pydantic 모델로 요청/응답 검증.

## 3. 통합 (Integration with Java Backend)

- **통신 방식**: MVP 단계에서는 gRPC 설정의 병목을 피하고자 `REST API`를 채택합니다.
- **데이터 통합 흐름**:
    1. Java `RiskCompositeEngine`에서 평가 로직 실행 중 Python 서버에 HTTP POST (Deal ID 전송) 요청을 보냅니다.
    2. Python 서버 오프라인 스토어(Mock Dict)에서 피처값을 가져온 후, 확률(0~100점) 값을 반환합니다.
    3. Java 로직에서 반환된 기계 학습 점수를 비즈니스 가중치와 혼합하여 최종 `RiskMaster` 총점을 산출합니다.

## 4. 고가용성 및 에러 처리 (Fallback)

- **서킷 브레이커 (Circuit Breaker)**: Python ML 서버가 오프라인이거나 응답 속도가 늦어지는(Timeout) 경우, Java 서버의 평가 로직 전체가 멈추는 것을 방지합니다.
- **수동 평가 모드 (Manual Mode)**: 통신 실패 시, 머신러닝 점수를 (예: 0점 또는 N/A 처리) 무시하고 순수 심사역의 가중치 점수 기반으로 계산하는 '안전 폴백(Fallback)' 로직을 발동시킵니다.
