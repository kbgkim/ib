package com.ib.domain.deal;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Core Domain Entity: Deal
 * Represents the central business object of the IB platform.
 */
@Entity
@Table(name = "deals", schema = "ib")
@Getter
@Setter
@NoArgsConstructor
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private DealStatus status = DealStatus.DRAFT;

    private Double valuation;
    private Double riskScore;

    public Deal(String name) {
        this.name = name;
        this.status = DealStatus.DRAFT;
    }

    /**
     * Business Logic: Update valuation and transition status
     */
    public void evaluate(double valuation) {
        this.valuation = valuation;
        this.status = DealStatus.VALUATED;
    }

    /**
     * Business Logic: Apply risk score and transition status
     */
    public void applyRisk(double riskScore) {
        this.riskScore = riskScore;
        this.status = DealStatus.RISK_EVALUATED;
    }

    /**
     * Business Logic: Final approval
     */
    public void approve() {
        if (this.status == DealStatus.RISK_EVALUATED) {
            this.status = DealStatus.APPROVED;
        }
    }

    /**
     * Helper for event payload
     */
    public String toJson() {
        return String.format("{\"id\":%s, \"name\":\"%s\", \"status\":\"%s\", \"valuation\":%s, \"risk\":%s}",
                id, name, status, valuation, riskScore);
    }
}
