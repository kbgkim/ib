package com.ib.pf.dto;

import java.math.BigDecimal;

public class PfWaterfallResponse {
    private int year;
    private BigDecimal grossRevenue;
    private BigDecimal opexPaid;
    private BigDecimal taxPaid;
    private BigDecimal seniorDsPaid;
    private BigDecimal dsraFunded;
    private BigDecimal mezzPaid;
    private BigDecimal equityDist;
    private BigDecimal residual;
    private BigDecimal dscr;

    private PfWaterfallResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PfWaterfallResponse r = new PfWaterfallResponse();
        public Builder year(int v) { r.year = v; return this; }
        public Builder grossRevenue(BigDecimal v) { r.grossRevenue = v; return this; }
        public Builder opexPaid(BigDecimal v) { r.opexPaid = v; return this; }
        public Builder taxPaid(BigDecimal v) { r.taxPaid = v; return this; }
        public Builder seniorDsPaid(BigDecimal v) { r.seniorDsPaid = v; return this; }
        public Builder dsraFunded(BigDecimal v) { r.dsraFunded = v; return this; }
        public Builder mezzPaid(BigDecimal v) { r.mezzPaid = v; return this; }
        public Builder equityDist(BigDecimal v) { r.equityDist = v; return this; }
        public Builder residual(BigDecimal v) { r.residual = v; return this; }
        public Builder dscr(BigDecimal v) { r.dscr = v; return this; }
        public PfWaterfallResponse build() { return r; }
    }

    // Getters
    public int getYear() { return year; }
    public BigDecimal getGrossRevenue() { return grossRevenue; }
    public BigDecimal getOpexPaid() { return opexPaid; }
    public BigDecimal getTaxPaid() { return taxPaid; }
    public BigDecimal getSeniorDsPaid() { return seniorDsPaid; }
    public BigDecimal getDsraFunded() { return dsraFunded; }
    public BigDecimal getMezzPaid() { return mezzPaid; }
    public BigDecimal getEquityDist() { return equityDist; }
    public BigDecimal getResidual() { return residual; }
    public BigDecimal getDscr() { return dscr; }
}
