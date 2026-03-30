package com.ib.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "T_IB_RISK_MASTER", schema = "ib")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskMaster {

    @Id
    @Column(name = "DEAL_ID")
    private String dealId;

    @Column(name = "TOTAL_SCORE")
    private BigDecimal totalScore;

    @Column(name = "FINAL_GRADE")
    private String finalGrade;

    @Column(name = "EVALUATOR_ID")
    private String evaluatorId;

    @Column(name = "EVAL_COMMENT")
    private String evalComment;

    @Column(name = "LAST_UPDATED")
    private LocalDateTime lastUpdated;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "DEAL_ID", nullable = false)
    @Builder.Default
    private List<RiskDetail> details = new ArrayList<>();

    @PrePersist
    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
