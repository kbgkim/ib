package com.ib.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "T_IB_HEDGING_STRATEGY", schema = "ib")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HedgingStrategy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ASSET_ID", nullable = false)
    private String assetId;

    @Column(name = "STRATEGY_TYPE", nullable = false)
    private String strategyType; // FX, CREDIT, COMMODITY, INTEREST

    @Column(name = "PRODUCT_NAME", nullable = false)
    private String productName;

    @Column(name = "RECOMMENDED_AMOUNT")
    private BigDecimal recommendedAmount;

    @Column(name = "EXPECTED_RISK_REDUCTION")
    private Double expectedRiskReduction;

    @Column(name = "CONFIDENCE_SCORE")
    private Double confidenceScore;

    @Column(name = "STATUS")
    private String status; // RECOMMENDED, EXECUTED, CANCELLED

    @Column(name = "EXECUTION_TIME")
    private LocalDateTime executionTime;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "RECOMMENDED";
    }
}
