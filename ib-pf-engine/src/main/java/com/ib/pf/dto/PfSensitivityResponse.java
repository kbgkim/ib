package com.ib.pf.dto;

public class PfSensitivityResponse {
    private String variable;
    private double baseDscr;
    private double dscrAt20PercentDown;
    private double dscrAt20PercentUp;
    private double sensitivityRange;
    private double dscrChangeDown;
    private double dscrChangeUp;

    private PfSensitivityResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PfSensitivityResponse r = new PfSensitivityResponse();
        public Builder variable(String v) { r.variable = v; return this; }
        public Builder baseDscr(double v) { r.baseDscr = v; return this; }
        public Builder dscrAt20PercentDown(double v) { r.dscrAt20PercentDown = v; return this; }
        public Builder dscrAt20PercentUp(double v) { r.dscrAt20PercentUp = v; return this; }
        public Builder sensitivityRange(double v) { r.sensitivityRange = v; return this; }
        public Builder dscrChangeDown(double v) { r.dscrChangeDown = v; return this; }
        public Builder dscrChangeUp(double v) { r.dscrChangeUp = v; return this; }
        public PfSensitivityResponse build() { return r; }
    }

    public String getVariable() { return variable; }
    public double getBaseDscr() { return baseDscr; }
    public double getDscrAt20PercentDown() { return dscrAt20PercentDown; }
    public double getDscrAt20PercentUp() { return dscrAt20PercentUp; }
    public double getSensitivityRange() { return sensitivityRange; }
    public double getDscrChangeDown() { return dscrChangeDown; }
    public double getDscrChangeUp() { return dscrChangeUp; }
}
