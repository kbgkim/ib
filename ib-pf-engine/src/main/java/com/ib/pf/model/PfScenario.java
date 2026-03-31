package com.ib.pf.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pf_scenario")
public class PfScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "scenario_name", nullable = false)
    private String scenarioName;

    @Column(name = "parameters", columnDefinition = "TEXT")
    private String parameters; // JSON string

    @Column(name = "metrics", columnDefinition = "TEXT")
    private String metrics; // JSON string

    @Column(name = "waterfall_data", columnDefinition = "TEXT")
    private String waterfallData; // JSON string

    @Column(name = "sensitivity_data", columnDefinition = "TEXT")
    private String sensitivityData; // JSON string

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public PfScenario() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getScenarioName() { return scenarioName; }
    public void setScenarioName(String scenarioName) { this.scenarioName = scenarioName; }
    public String getParameters() { return parameters; }
    public void setParameters(String parameters) { this.parameters = parameters; }
    public String getMetrics() { return metrics; }
    public void setMetrics(String metrics) { this.metrics = metrics; }
    public String getWaterfallData() { return waterfallData; }
    public void setWaterfallData(String waterfallData) { this.waterfallData = waterfallData; }
    public String getSensitivityData() { return sensitivityData; }
    public void setSensitivityData(String sensitivityData) { this.sensitivityData = sensitivityData; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
