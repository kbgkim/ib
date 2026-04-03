# 글로벌 리스크 전파 및 비선형 증폭 모델 사양서 (v1.0)

## 1. 개요 (Overview)
본 사양서는 IB 플랫폼의 **Phase 15: 글로벌 자산 모니터링** 시스템에서 자산 간의 리스크 전이 및 충격 전파를 계산하는 알고리즘을 정의합니다. 지리적/경제적으로 연결된 자산들 사이의 의존성을 분석하여, 특정 지점의 고위험이 전체 포트폴리오로 확산되는 시나리오를 시뮬레이션합니다.

## 2. 데이터 모델 (Data Model)

### 2.1 글로벌 자산 (`T_IB_GLOBAL_ASSET`)
전 세계에 흩어진 물리적/금융적 자산의 마스터 정보를 저장합니다.
- `base_risk_score`: 해당 자산 자체의 고유 리스크 점수 (0-100).
- `latitude`, `longitude`: 지리적 시각화를 위한 좌표 데이터.

### 2.2 리스크 링크 (`T_IB_ASSET_RISK_LINK`)
자산 간의 의존성 및 리스크 전이 경로를 정의합니다.
- `propagation_weight`: 리스크 전이 강도 (0.0 ~ 1.0).
- `link_type`: 관계 유형 (예: `SUPPLY_CHAIN`, `FINANCIAL_DEPENDENCY`, `GEOPOLITICAL`).

## 3. 리스크 전파 알고리즘 (Propagation Algorithm)

### 3.1 기본 전파 모델 (Linear Propagation)
소스 자산의 리스크가 타겟 자산으로 전이될 때, 설정된 가중치를 곱하여 충격량을 산출합니다.
$$Impact_{target} = Risk_{source} \times Weight_{link}$$

### 3.2 비선형 증폭 모델 (Non-linear Sigmoid Amplification)
소스 자산의 리스크가 특정 **임계점(Threshold: 70)**을 초과할 경우, 리스크의 파급력이 기하급수적으로 증가하는 현상을 모델링합니다.

- **임계점 미만 ($Risk_{source} \le 70$):** 선형 전파 적용.
- **임계점 초과 ($Risk_{source} > 70$):** 비선형 증폭 가중치($\alpha$) 적용.
    - 증폭 계수($\alpha$)는 소스 리스크의 강도에 비례하여 1.0에서 최대 1.5까지 동적으로 증가합니다.
    - 최종 충격량은 $100$을 초과할 수 없도록 캡핑(Capping) 처리됩니다.

## 4. UI/UX 연동 사양
- **Map Visualization**: `react-simple-maps`를 사용하여 자산 위치 표시.
- **Shockwave Animation**: 리스크 전파 발생 시 소스에서 타겟으로 이동하는 시각적 펄스(Pulse) 애니메이션 적용.
- **Color Mapping**: 리스크 점수에 따른 동적 색상 코드 (0-40: Green, 41-70: Amber, 71-100: Red).

---
**Last Updated**: 2026-04-03 | **Status**: Verified by Implementation
