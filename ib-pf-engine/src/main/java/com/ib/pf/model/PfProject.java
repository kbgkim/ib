package com.ib.pf.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pf_project")
public class PfProject {

    @Id
    private String id;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "deal_type")
    private String dealType = "PF";

    @Column(name = "total_capex", nullable = false)
    private BigDecimal totalCapex;

    @Column(name = "equity_ratio", nullable = false)
    private BigDecimal equityRatio;

    @Column(name = "debt_ratio", nullable = false)
    private BigDecimal debtRatio;

    @Column(name = "loan_tenure", nullable = false)
    private int loanTenure;

    @Column(name = "construction_period", nullable = false)
    private int constructionPeriod;

    @Column(name = "discount_rate", nullable = false)
    private BigDecimal discountRate;

    @Column(name = "project_life", nullable = false)
    private int projectLife;

    @Column(name = "status")
    private String status;

    @Column(name = "inflation_rate")
    private BigDecimal inflationRate = BigDecimal.valueOf(0.02); // 2% Default

    @Column(name = "yield_curve_id")
    private String yieldCurveId; // e.g., "LIBOR_3M", "KORIBOR_3M"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters & Setters
    public BigDecimal getInflationRate() { return inflationRate; }
    public void setInflationRate(BigDecimal inflationRate) { this.inflationRate = inflationRate; }
    public String getYieldCurveId() { return yieldCurveId; }
    public void setYieldCurveId(String yieldCurveId) { this.yieldCurveId = yieldCurveId; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getDealType() { return dealType; }
    public void setDealType(String dealType) { this.dealType = dealType; }
    public BigDecimal getTotalCapex() { return totalCapex; }
    public void setTotalCapex(BigDecimal totalCapex) { this.totalCapex = totalCapex; }
    public BigDecimal getEquityRatio() { return equityRatio; }
    public void setEquityRatio(BigDecimal equityRatio) { this.equityRatio = equityRatio; }
    public BigDecimal getDebtRatio() { return debtRatio; }
    public void setDebtRatio(BigDecimal debtRatio) { this.debtRatio = debtRatio; }
    public int getLoanTenure() { return loanTenure; }
    public void setLoanTenure(int loanTenure) { this.loanTenure = loanTenure; }
    public int getConstructionPeriod() { return constructionPeriod; }
    public void setConstructionPeriod(int constructionPeriod) { this.constructionPeriod = constructionPeriod; }
    public BigDecimal getDiscountRate() { return discountRate; }
    public void setDiscountRate(BigDecimal discountRate) { this.discountRate = discountRate; }
    public int getProjectLife() { return projectLife; }
    public void setProjectLife(int projectLife) { this.projectLife = projectLife; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
