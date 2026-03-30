package com.ib.domain.risk;

import lombok.Getter;

@Getter
public enum RiskGrade {
    AAA(90, 100, "Excellent (Safe)"),
    AA(80, 89, "Very Good"),
    A(70, 79, "Good"),
    B(50, 69, "Satisfactory"),
    D(0, 49, "Default / High Risk");

    private final int minScore;
    private final int maxScore;
    private final String description;

    RiskGrade(int minScore, int maxScore, String description) {
        this.minScore = minScore;
        this.maxScore = maxScore;
        this.description = description;
    }

    public static RiskGrade fromScore(double score) {
        for (RiskGrade grade : values()) {
            if (score >= grade.minScore && score <= grade.maxScore) {
                return grade;
            }
        }
        return D; // Default to lowest if out of range
    }
}
