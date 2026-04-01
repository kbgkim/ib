# Phase 5: VDR NLP & Macro Scenario (Deep Dive)

## 1. 개요 (Overview)
본 문서는 실사 문서의 지능형 요약 엔진인 **AI VDR Intelligence**와 거시경제 변동성을 시뮬레이션하는 **Macro Stress Scenario**의 기술 설계 및 구현 내역을 상세히 기록합니다.

## 2. AI VDR 지능형 분석 (VDR Intelligence)

### 2.1 NLP 분석 파이프라인
- **엔진**: `ib-ml-engine` (FastAPI 기반 Python 서버).
- **기술 상세**:
    - **요약**: 실사 문서(텍스트 데이터)를 입력받아 주요 리스크 요인(Risk Factors)을 자동 추출하고 3줄 요약 제공.
    - **감성 분석(Sentiment)**: 문서의 톤(Positive, Neutral, Negative)을 분석하여 리스크 점수(`riskAdjustment`)를 가감하는 보정치 산출.
    - **데이터 직렬화**: Pydantic 모델을 사용하여 정형화된 JSON 응답(Summary, Factors, Sentiment)을 Java 통계 서버로 전송.

### 2.2 VDR 리얼타임 로그 연동
- 사용자의 문서 접근 패턴과 지연 시간을 실시간 모니터링하여 가상 보안 리스크 점수 산출 로직 통합.

## 3. 매크로 스트레스 테스트 (Macro Stress Test)

### 3.1 시나리오 모델링
- **금리 곡선 이동 (Yield Curve Shift)**: 시장 금리(UST 10Y) 급등 시 프로젝트 WACC에 미치는 영향 및 NPV 하락폭 시뮬레이션.
- **인플레이션 충격 (CPI Shock)**: 에너지 가격 및 CAPEX 상승에 따른 운영비(`OpEx`) 증가 및 DSCR 임계치(`1.15x`) 하회 여부 실시간 진단.

### 3.2 UI/UX 구현 (Tornado Chart)
- **민감도 분석**: 각 변수가 수익성에 미치는 임팩트를 토네이도 차트(Tornado Chart)로 시각화하여 가장 위험한 변수를 우선 식별.

## 4. 백엔드 연동 (Integration Logic)
- **`VdrController.java` (ib-mna-engine)**: UI에서 전달된 텍스트를 ML 엔진으로 전달하고, 반환된 요약본을 대시보드에 소켓 및 API 응답으로 즉시 반영.
