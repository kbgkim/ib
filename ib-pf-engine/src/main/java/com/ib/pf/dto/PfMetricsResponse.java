package com.ib.pf.dto;

import java.math.BigDecimal;

public class PfMetricsResponse {
    private String projectId;
    private String projectName;
    private BigDecimal minDscr;
    private BigDecimal avgDscr;
    private BigDecimal llcr;
    private BigDecimal plcr;
    private BigDecimal annualDebtService;
    private BigDecimal totalDebt;
    private String dscrGrade;
    private String llcrGrade;
    private String plcrGrade;
    private int operationalYears;

    private PfMetricsResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PfMetricsResponse r = new PfMetricsResponse();
        public Builder projectId(String v) { r.projectId = v; return this; }
        public Builder projectName(String v) { r.projectName = v; return this; }
        public Builder minDscr(BigDecimal v) { r.minDscr = v; return this; }
        public Builder avgDscr(BigDecimal v) { r.avgDscr = v; return this; }
        public Builder llcr(BigDecimal v) { r.llcr = v; return this; }
        public Builder plcr(BigDecimal v) { r.plcr = v; return this; }
        public Builder annualDebtService(BigDecimal v) { r.annualDebtService = v; return this; }
        public Builder totalDebt(BigDecimal v) { r.totalDebt = v; return this; }
        public Builder dscrGrade(String v) { r.dscrGrade = v; return this; }
        public Builder llcrGrade(String v) { r.llcrGrade = v; return this; }
        public Builder plcrGrade(String v) { r.plcrGrade = v; return this; }
        public Builder operationalYears(int v) { r.operationalYears = v; return this; }
        public PfMetricsResponse build() { return r; }
    }

    // Getters
    public String getProjectId() { return projectId; }
    public String getProjectName() { return projectName; }
    public BigDecimal getMinDscr() { return minDscr; }
    public BigDecimal getAvgDscr() { return avgDscr; }
    public BigDecimal getLlcr() { return llcr; }
    public BigDecimal getPlcr() { return plcr; }
    public BigDecimal getAnnualDebtService() { return annualDebtService; }
    public BigDecimal getTotalDebt() { return totalDebt; }
    public String getDscrGrade() { return dscrGrade; }
    public String getLlcrGrade() { return llcrGrade; }
    public String getPlcrGrade() { return plcrGrade; }
    public int getOperationalYears() { return operationalYears; }
}
