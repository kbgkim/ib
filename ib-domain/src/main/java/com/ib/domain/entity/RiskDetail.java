package com.ib.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "T_IB_RISK_DETAIL", schema = "ib")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DETAIL_ID")
    private Long id;

    @Column(name = "DEAL_ID", insertable = false, updatable = false)
    private String dealId;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "FACTOR_NAME")
    private String factorName;

    @Column(name = "RAW_VALUE")
    private BigDecimal rawValue;

    @Column(name = "WEIGHTED_SCORE")
    private BigDecimal weightedScore;
}
