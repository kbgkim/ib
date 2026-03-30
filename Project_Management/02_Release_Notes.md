# IB Platform Release Notes

## [v0.3.5] - 2026-03-30
### Added
- 저장소 동기화 복구 (네트워크 분리 상황 해결 및 내부망 서버 최신화).
- 개발 환경 단일화 (불필요한 워크트리 정리 및 `projects/ib` 통합).
- `OPERATIONS.md` 내 저장소 및 브랜치 관리 정책 가이드 추가.

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
