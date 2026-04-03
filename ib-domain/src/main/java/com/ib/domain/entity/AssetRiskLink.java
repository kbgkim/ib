package com.ib.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "T_IB_ASSET_RISK_LINK", schema = "ib")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetRiskLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String sourceAssetId;

    @Column(nullable = false, length = 50)
    private String targetAssetId;

    private double propagationWeight; // 0.0 - 1.0 (How much risk is propagated)

    @Column(length = 20)
    private String linkType; // SUPPLY_CHAIN, FINANCIAL, REGIONAL, INFRASTRUCTURE

    private String description;
}
