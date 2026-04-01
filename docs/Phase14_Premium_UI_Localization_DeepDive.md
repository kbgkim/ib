# Phase 14: Premium UI/UX Overhaul & Global Localization (Deep Dive)

## 1. 개요 (Overview)
본 문서는 IB 플랫폼 고도화의 일환으로 수행된 **Phase 14: 스테이크홀더 포털 프리미엄 UX 개편 및 전방위 로컬라이징**에 대한 상세 기술 사양을 기록합니다.

## 2. 기술적 구현 상세 (Technical Implementation)

### 2.1 프리미엄 인증 및 스캔 애니메이션
- **컴포넌트**: `ClientPortal.jsx`
- **구현 로직**: 
    - 사용자가 패스코드(`DEAL-TITAN`) 입력 시 `isScanning` 상태를 `true`로 전환.
    - `setTimeout`을 이용해 2.5초간의 지연 시간을 강제 부여하여 보안 시스템이 작동하는 듯한 사용자 경험(UX) 제공.
    - **UI 요소**: `ShieldCheck` 아이콘의 `pulse-glow` 효과와 `.scanline` 오버레이 애니메이션을 통해 'Technical Scanning' 상태 시각화.

### 2.2 고유 투자자 티어링 시스템 (Investor Tier Branding)
- **컴포넌트**: `InvestorTierCard.jsx`
- **디자인 사양**: 
    - `T1 (Anchor)`: `--gold-metallic` 그라데이션 상단 바 및 `glow-border-green` 효과.
    - `T2 (Institutional)`: `--silver-metallic` 상단 바 및 `glow-border-blue` 효과.
- **로직**: `tierMeta` 객체를 통해 티어별 권한(Priority), 혜택(Benefits), 의무(Lock-up) 데이터를 관리하며 각 카드는 `t()` 함수를 통해 전수 번역 지원.

### 2.3 전역 로컬라이징 시스템 (i18n)
- **중앙 사전**: `src/utils/translations.js`
- **구현 방식**: 
    - `App.jsx`에서 `lang` 상태와 `t(key)` 함수를 하위 컴포넌트로 전파.
    - 화폐 및 수치 단위(`unit_m`, `unit_b`, `unit_usd`)를 번역 사전에 포함하여 언어별로 상이한 표현(예: 억원 vs B USD)을 동적으로 처리.
- **하드코딩 제거**: `PortfolioCommandCenter`, `PfDashboard`, `StrategyAdvisor` 내의 모든 영문 리터럴을 `t()` 호출로 전환.

## 3. 디버깅 및 트러블슈팅 (Debugging & Troubleshooting)

### 3.1 InvestorTierCard Syntax Error
- **증상**: PF 파이낸스 탭 클릭 시 화면이 백지로 변하는 'White-out' 현상 발생.
- **원인**: `InvestorTierCard.jsx` 파일 내에 `return (` 구문이 중복 기입되어 Vite 빌드 프로세스 중 `Unexpected token` 오류 발생.
- **조치**: `write_to_file` 명령을 통해 중복 구문을 제거하고 클린 소스코드로 덮어쓰기 완료.

### 3.2 PfDashboard ReferenceError
- **증상**: 대시보드 렌더링 중 `ReferenceError: t is not defined` 발생.
- **원인**: `PfDashboard.jsx` 내부에 선언된 `TornadoChart` 컴포넌트에 번역 함수 `t`가 프롭(prop)으로 전달되지 않은 상태에서 호출됨.
- **조치**: `TornadoChart` 인터페이스에 `t` 프롭을 추가하고 부모 컴포넌트(`PfDashboard`)로부터 이를 명시적으로 전달하도록 수정.

## 4. 향후 유지보수 지침
- 새로운 하드코딩 문자열 추가를 금지하며, 반드시 `translations.js`에 키를 등록한 후 사용해야 합니다.
- `docs/` 폴더 내의 Deep Dive 문서는 세션 종료 시 반드시 최신 구현 내역으로 업데이트되어야 합니다.
