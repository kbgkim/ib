package com.ib.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "T_IB_GLOBAL_ASSET", schema = "ib")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalAsset {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 20)
    private String assetType; // ENERGY, INFRA, TECH, RENEWABLES

    @Column(length = 50)
    private String region; // ASIA, AMER, EMEA

    private double latitude;
    private double longitude;

    @Column(precision = 19, scale = 4)
    private BigDecimal valuation;

    private double baseRiskScore; // 0-100

    @Column(length = 20)
    private String status; // ACTIVE, WARNING, CRITICAL
}
