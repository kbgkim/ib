package com.ib.pf.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "pf_cashflow")
public class PfCashFlow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "project_year", nullable = false)
    private int projectYear;

    private BigDecimal revenue = BigDecimal.ZERO;
    private BigDecimal opex = BigDecimal.ZERO;

    @Column(name = "tax_amount")
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private BigDecimal capex = BigDecimal.ZERO;
    private BigDecimal cfads = BigDecimal.ZERO;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public int getProjectYear() { return projectYear; }
    public void setProjectYear(int projectYear) { this.projectYear = projectYear; }
    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    public BigDecimal getOpex() { return opex; }
    public void setOpex(BigDecimal opex) { this.opex = opex; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public BigDecimal getCapex() { return capex; }
    public void setCapex(BigDecimal capex) { this.capex = capex; }
    public BigDecimal getCfads() { return cfads; }
    public void setCfads(BigDecimal cfads) { this.cfads = cfads; }
}
