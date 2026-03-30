package com.ib.pf.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "pf_tranche")
public class PfTranche {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "tranche_name", nullable = false)
    private String trancheName;

    private String seniority; // SENIOR, MEZZANINE, EQUITY

    private BigDecimal principal;

    @Column(name = "interest_rate")
    private BigDecimal interestRate;

    private int tenure;

    @Column(name = "grace_period")
    private int gracePeriod = 0;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getTrancheName() { return trancheName; }
    public void setTrancheName(String trancheName) { this.trancheName = trancheName; }
    public String getSeniority() { return seniority; }
    public void setSeniority(String seniority) { this.seniority = seniority; }
    public BigDecimal getPrincipal() { return principal; }
    public void setPrincipal(BigDecimal principal) { this.principal = principal; }
    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public int getTenure() { return tenure; }
    public void setTenure(int tenure) { this.tenure = tenure; }
    public int getGracePeriod() { return gracePeriod; }
    public void setGracePeriod(int gracePeriod) { this.gracePeriod = gracePeriod; }
}
