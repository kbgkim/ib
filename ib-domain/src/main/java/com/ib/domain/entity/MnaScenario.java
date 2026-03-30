package com.ib.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "mna_scenarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MnaScenario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dealId;

    @Column(nullable = false)
    private String scenarioName; // BEAR, BASE, BULL

    @Column(precision = 5, scale = 2)
    private BigDecimal synergyCaptureRate; 

    @Column(precision = 5, scale = 4)
    private BigDecimal waccAdjustment;
}
