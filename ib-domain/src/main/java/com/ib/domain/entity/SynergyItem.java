package com.ib.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "synergy_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SynergyItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dealId;

    @Column(nullable = false)
    private String category; // COST, REVENUE, FINANCIAL

    @Column(nullable = false)
    private String name;

    @Column(precision = 19, scale = 4)
    private BigDecimal estimatedValue;

    private Integer realizationYear; // Y1, Y2, etc.
}
