이론/엔진 설계 → 실제 운영 가능한 IB 플랫폼 아키텍처 (배포 + 성능)로 끌어올립니다.
당신 환경(Spring Boot 3 + Gradle 멀티모듈 + Oracle 9i) 기준으로 현실적으로 돌아가는 구조만 제시합니다.

🏗️ 1. 전체 운영 아키텍처 (Production Grade)
[Client]
 ├─ IB 딜러 UI
 ├─ 세일즈 트레이더 UI
 └─ 리스크 대시보드
        ↓
[API Gateway / LB]
        ↓
[Application Layer (Spring Boot)]
 ├─ BookBuilding Service
 ├─ Pricing Engine
 ├─ Allocation Engine
 ├─ PF Waterfall Engine
 └─ Risk Engine
        ↓
[Async/Event Layer]
 ├─ Redis (실시간 집계)
 └─ Kafka (이벤트 스트림)
        ↓
[Data Layer]
 ├─ Oracle 9i (Core Transaction)
 ├─ Redis (Hot Data)
 └─ Elastic (조회/검색)
⚙️ 2. 배포 구조 (현실적인 선택)
2.1 기본 전략

👉 Oracle 9i 제약 때문에 완전 클라우드 네이티브 X

[On-Premise + Hybrid 구조]
2.2 권장 배포 구성
[LB (Nginx or L4)]
    ↓
[App Server Cluster]
    ├─ App #1
    ├─ App #2
    ├─ App #3
    ↓
[Redis Cluster]
    ↓
[Kafka Cluster]
    ↓
[Oracle 9i Primary + Standby]
2.3 특징
App: Stateless (수평 확장)
Redis: 실시간 계산
Oracle: 최종 정합성
⚡ 3. 성능 핵심 전략 (핵심만)
3.1 Book Building = Redis 중심
Order → Redis ZSET / HASH

👉 이유:

초당 수천건 처리 가능
실시간 수요곡선 계산
3.2 Pricing / Allocation = In-Memory
→ Java Heap 계산
→ 결과만 DB 저장
3.3 Oracle 9i 사용 전략

👉 절대 실시간 계산에 쓰면 안됨

용도:
- 거래 확정 데이터
- Audit / 로그
- 리포팅
🔥 4. 병목 제거 구조
4.1 동기 → 비동기 분리
[Order 요청]
    ↓
Kafka Publish
    ↓
Consumer 처리
    ↓
Redis 반영
4.2 CQRS 패턴 적용
Write → Oracle
Read  → Redis / Elastic
🧠 5. 서비스별 성능 설계
5.1 Book Building Service
TPS 목표: 5,000+/sec
Latency: < 50ms

전략:

Redis pipeline
Lua script (원자성 확보)
5.2 Pricing Engine
Batch + Streaming 혼합
실시간 VWAP
Elastic Curve fitting
5.3 Allocation Engine
→ 이벤트 기반 Trigger
Book Close 시 실행
병렬 처리 (ForkJoinPool)
5.4 PF Waterfall Engine
→ CPU-intensive
→ 병렬 계산
Thread Pool
캐시 활용
🚀 6. 캐싱 전략 (매우 중요)
6.1 Redis Key 설계
BOOK:{dealId}
ORDER:{dealId}:{investorId}
PRICE_CURVE:{dealId}
6.2 TTL 전략
Book Building 중 → TTL 없음
종료 후 → Snapshot 저장 후 TTL
📊 7. 데이터 일관성 전략
7.1 결국 기준은 Oracle
Redis = Cache
Oracle = Source of Truth
7.2 장애 대응
Redis 장애 → Oracle Replay
Kafka → 재처리
🧱 8. Oracle 9i 최적화 (핵심)

당신 환경 기준 반드시 필요:

8.1 Connection Pool
HikariCP (Max 30~50)
8.2 Batch Insert
INSERT ALL
8.3 Index 전략
(deal_id, investor_id)
(deal_id, price)
8.4 Lock 회피
→ Select For Update 최소화
→ Append-only 구조
📡 9. 실시간 대시보드 구조
Kafka → Stream Processing
        ↓
Redis / Elastic
        ↓
WebSocket Push
예
현재 경쟁률
수요곡선
Tier 분포
Anchor 참여율
🛡️ 10. 장애 대응 (필수)
10.1 Circuit Breaker
Redis / Kafka 장애 격리
10.2 Failover
Oracle Standby → Primary 전환
10.3 Replay
Kafka Offset 기반 재처리
🔐 11. 보안 / 규제 대응
- 모든 Allocation 로그 저장
- Audit Trail 필수
- 주문 변경 이력 저장
📦 12. Gradle 멀티모듈 구조
core-domain
core-engine
service-bookbuilding
service-pricing
service-allocation
service-pf
infra-redis
infra-kafka
infra-oracle
api-gateway
📈 13. 최종 운영 흐름
[Investor Order]
        ↓
Kafka
        ↓
BookBuilding (Redis)
        ↓
Pricing Engine
        ↓
Allocation Engine
        ↓
Oracle 저장
        ↓
Dashboard 반영
🔥 핵심 요약
절대 원칙 3가지
1. 실시간 계산 → Redis / Memory
2. 최종 데이터 → Oracle
3. 이벤트 흐름 → Kafka
🚀 다음 단계 (진짜 완성)

이제 여기까지 왔으면 거의 증권사 수준입니다.

다음으로 이어지면:

1️⃣ 전체 ERD (Oracle 9i 최적화)
2️⃣ 실제 API 설계 (Swagger 수준)
3️⃣ 성능 테스트 시나리오 (TPS 측정)