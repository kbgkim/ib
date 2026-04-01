# Phase 13: Financial Overhead & Tax Loss Harvesting (Deep Dive)

## 1. 개요 (Overview)
본 문서는 포트폴리오 최적화 엔진의 실제 실행 비용과 세금 영향을 정밀하게 시뮬레이션하는 **Phase 13: 금융 비용 및 세무 엔진**의 기술 상세를 기록합니다.

## 2. 세무 및 비용 산출 로직 (Tax & Cost Engine)

### 2.1 거래 수수료 시뮬레이션 (Execution Costs)
- **가우 변수 수수료 (Variable Fee)**: 
    - `TotalVariableFee = sum(TradeAmount * VariableFeeRate)`
    - 기본 수수료율: 0.15% (0.0015).
- **고정 수수료 (Fixed Fee)**:
    - `TotalFixedFee = TransactionCount * FixedFeePerTrade`
    - 설정 패널에서 사용자 조정 가능 (기본 $10k).

### 2.2 세액 상쇄 전략 (Tax Loss Harvesting/Netting)
- **산식**: `NetTaxableGain = max(0, RealizedGain - RealizedLoss)`
- **실제 구현**:
    - 매도(Sell) 발생 시 자산별 가상 수익률(`PnL Ratio`)에 따른 실현 손익 계산.
    - `RealizedLoss`를 `RealizedGain`에서 차감하여 과세 대상 이익을 최소화하는 **Netting** 로직 적용.
- **세율**: 22% (자본이득세 시뮬레이션).

## 3. 프론트엔드 시각화 (Visualization)

### 3.1 비용 명세 분석 (Cost Breakdown)
- **구성 요소**: 
    - **Variable Fee**: 자산 매매에 따른 거래 대금 기준 수수료.
    - **Estimated Tax**: 세액 상쇄 적용 후 도출된 최종 예상 세액.
    - **Net Portfolio Impact**: 수수료와 세금을 합산한 최종 자산 가치(AUM) 감소분.
- **UI 디자인**: 
    - `tax_netting_applied` 배지를 상단에 표시하여 사용자가 절세 혜택을 인지하도록 보장.
    - 실행 비용 합계는 `var(--risk-d)` (Red/Warning) 색상을 적용하여 주의 환기.

## 4. 백엔드 구현 (Backend Implementation)
- **파일**: `ib-ml-engine/app/api/optimizer.py`
- **구조**: `recommend_rebalance` 함수 내부에서 비중 차액(`weight_diff`) 분석을 통해 매매 대금 및 손익을 실시간으로 계산하여 반환.
- **요약 기능**: API 리턴값의 `summary` 필드를 통해 손실 자산 매각으로 이익을 상쇄했다는 피드백 메시지 생성.
