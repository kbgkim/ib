---
ID: IB-DOC-P02
Title: PF Waterfall 계산 엔진 사양 / PF Waterfall Calculation Engine Specification (Java)
Category: Product Structure / Engine
Version: 1.2
Status: Formalized
---

# [IB-DOC-P02] PF Waterfall 계산 엔진 사양

본 사양서는 PF 딜의 현금흐름 배분을 처리하기 위한 **Waterfall Rule Engine**의 기술적 구현 방식과 핵심 알고리즘을 정의합니다.

---

## 1. 엔진 설계 원칙 (Design Principles)

- **Rule-based Processing**: 고정된 코드가 아닌, DB에 정의된 우선순위와 규칙에 따라 동작함.
- **Precision (정밀도)**: 금융 계산의 정확성을 위해 `java.math.BigDecimal`을 사용함.
- **State Integrity**: 배분 전후의 현금 잔액 및 누적 상환액의 정합성을 보장함.

---

## 2. 핵심 알고리즘 (Core Logic)

1.  **우선순위 정렬**: 각 트랜치와 비용 항목을 `priority` 순으로 정렬.
2.  **가용 현금 확인**: 현 시점의 가용 현금(`remainingCash`)에서 차감 시작.
3.  **순차 배분**:
    -   지급액 = min(가용 현금, 대상 항목의 미지급 잔액).
    -   가용 현금 = 가용 현금 - 지급액.
4.  **잔여 처리**: 모든 우선순위 배분 후 남은 현금은 Equity 배당 또는 유보금으로 처리.

---

## 3. 핵심 코드 구조 (Implementation Snippets)

```java
public Result execute(CashFlow cashFlow, List<Tranche> tranches) {
    List<Tranche> sorted = tranches.stream()
            .sorted(Comparator.comparingInt(Tranche::getPriority))
            .collect(Collectors.toList());

    BigDecimal remaining = cashFlow.getAmount();

    for (Tranche t : sorted) {
        if (remaining.compareTo(BigDecimal.ZERO) <= 0) break;

        BigDecimal need = t.getRemaining();
        BigDecimal pay = remaining.min(need);

        t.addPayment(pay);
        remaining = remaining.subtract(pay);
    }
    return new Result(sorted, remaining);
}
```

---

> [!NOTE]
> 실무에서는 **동순위(Pro-rata) 배분**과 **DSCR 트리거** 등의 복합 규칙이 추가될 수 있습니다. 세부 구현 가이드는 [PF_Waterfall_Calculation_Engine_Ref.md](file:///home/kbgkim/antigravity/projects/ib-risk-worktree/Archive_Drafts/02_Deal_Structures/PF_Waterfall_Calculation_Engine.md) 원본 초안을 참조하십시오.
