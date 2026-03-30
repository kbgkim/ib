# IB Platform Release Notes

## [v0.4.0] - 2026-03-30
### Added
- **Interactive Probability Bridge (v1.5)**: 3가지 시나리오(Bear/Base/Bull)의 확률 가중치 합성 시스템 도입.
- **Proportional Auto-balancing UI**: 단일 슬라이더로 3단계 가중치를 비례 제어하는 멀티 슬라이더 UI 구현.
- **Sensitivity Range (Error Bars)**: Waterfall 차트에 시나리오별 변동폭(Sensitivity) 시각화 추가.
- **Latency-Free Simulation**: 프론트엔드 실시간 가중 평균 계산 로직 적용 (useMemo 최적화).
- **Deep Dive Documentation**: 상세 기술 설계 문서(`docs/Interactive_Probability_Bridge_DeepDive.md`) 추가.

## [v0.3.5] - 2026-03-30

## [v0.3.4] - 2026-03-30
### Added
- Integrated Real-time ML/VDR Risk Engine.
- Premium React Dashboard for risk visualization.
- FastAPI based ML microservice (`ib-ml-engine`).
- Integrated management scripts (`bin/manage.sh`, `bin/ib_env`).
- Environment aliases for service control (`ibrun`, `ibstop`, `ibsts`).

### Changed
- Refactored project directory structure for multi-module support.
- Updated `.gitignore` to track critical configuration files in `bin/`.
- Optimized log rotation and management paths.

---

## [v0.3.0] - 2026-03-29
### Added
- M&A Synergy and Valuation Engine (Layer 03).
- PostgreSQL 14 persistence layer for audit trails.
- Multi-module Java project structure (`ib-common`, `ib-domain`, `ib-mna-engine`).

### Fixed
- Resolved dependency conflicts between Spring Boot and Gradle 7.x.

---

## [v0.1.0] - 2026-03-28
### Added
- Initial project boilerplate and domain standard specifications.
- ECM/DCM/PF high-level workflow designs.
