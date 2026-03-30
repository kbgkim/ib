package com.ib.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "valuation_results")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ValuationResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dealId;

    @Column(nullable = false)
    private String method; // DCF, MULTIPLES

    @Column(precision = 19, scale = 4)
    private BigDecimal value;

    @Column(precision = 5, scale = 2)
    private BigDecimal weight; // e.g., 0.60
}
