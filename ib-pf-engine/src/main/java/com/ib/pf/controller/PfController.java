package com.ib.pf.controller;

import com.ib.pf.dto.PfMetricsResponse;
import com.ib.pf.dto.PfSensitivityResponse;
import com.ib.pf.dto.PfWaterfallResponse;
import com.ib.pf.model.PfProject;
import com.ib.pf.model.PfScenario;
import com.ib.pf.repository.PfProjectRepository;
import com.ib.pf.repository.PfScenarioRepository;
import com.ib.pf.service.PfMetricsEngine;
import com.ib.pf.service.PfReportService;
import com.ib.pf.service.PfSensitivityEngine;
import com.ib.pf.service.PfWaterfallEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pf")
@CrossOrigin(origins = "http://localhost:3000")
public class PfController {

    private final PfProjectRepository projectRepo;
    private final PfScenarioRepository scenarioRepo;
    private final PfMetricsEngine metricsEngine;
    private final PfWaterfallEngine waterfallEngine;
    private final PfSensitivityEngine sensitivityEngine;
    private final PfReportService reportService;

    public PfController(PfProjectRepository projectRepo,
                        PfScenarioRepository scenarioRepo,
                        PfMetricsEngine metricsEngine,
                        PfWaterfallEngine waterfallEngine,
                        PfSensitivityEngine sensitivityEngine,
                        PfReportService reportService) {
        this.projectRepo = projectRepo;
        this.scenarioRepo = scenarioRepo;
        this.metricsEngine = metricsEngine;
        this.waterfallEngine = waterfallEngine;
        this.sensitivityEngine = sensitivityEngine;
        this.reportService = reportService;
    }

    /**
     * GET /api/v1/pf/projects — 전체 프로젝트 목록 조회
     */
    @GetMapping("/projects")
    public ResponseEntity<List<PfProject>> getProjects() {
        return ResponseEntity.ok(projectRepo.findAll());
    }

    /**
     * GET /api/v1/pf/{id} — 단건 프로젝트 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<PfProject> getProject(@PathVariable String id) {
        return projectRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/v1/pf/project — 신규 프로젝트 생성
     */
    @PostMapping("/project")
    public ResponseEntity<PfProject> createProject(@RequestBody PfProject project) {
        return ResponseEntity.ok(projectRepo.save(project));
    }

    /**
     * GET /api/v1/pf/{id}/metrics — DSCR/LLCR/PLCR 계산 결과
     */
    @GetMapping("/{id}/metrics")
    public ResponseEntity<PfMetricsResponse> getMetrics(@PathVariable String id) {
        return ResponseEntity.ok(metricsEngine.calculate(id));
    }

    /**
     * GET /api/v1/pf/{id}/waterfall — Waterfall 분배 실행 결과
     */
    @GetMapping("/{id}/waterfall")
    public ResponseEntity<List<PfWaterfallResponse>> getWaterfall(@PathVariable String id) {
        return ResponseEntity.ok(waterfallEngine.runWaterfall(id));
    }

    /**
     * GET /api/v1/pf/{id}/sensitivity — 민감도 분석 (Tornado 차트 데이터)
     */
    @GetMapping("/{id}/sensitivity")
    public ResponseEntity<List<PfSensitivityResponse>> getSensitivity(@PathVariable String id) {
        return ResponseEntity.ok(sensitivityEngine.analyze(id));
    }

    /**
     * POST /api/v1/pf/{id}/scenario — 시뮬레이션 결과(스냅샷) 저장
     */
    @PostMapping("/{id}/scenario")
    public ResponseEntity<PfScenario> saveScenario(@PathVariable String id, @RequestBody PfScenario scenario) {
        scenario.setProjectId(id);
        return ResponseEntity.ok(scenarioRepo.save(scenario));
    }

    /**
     * GET /api/v1/pf/{id}/scenarios — 프로젝트별 저장된 시나리오 목록 조회
     */
    /**
     * GET /api/v1/pf/{id}/report — 프로젝트 리스크 리포트 다운로드 (PDF)
     */
    @GetMapping("/{id}/report")
    public ResponseEntity<byte[]> getReport(@PathVariable String id) {
        PfProject project = projectRepo.findById(id).orElseThrow();
        com.ib.pf.dto.PfMetricsResponse metrics = metricsEngine.calculate(id);
        
        byte[] pdf = reportService.generateProjectReport(project, metrics);
        
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=Project_Report_" + id + ".pdf")
            .header("Content-Type", "application/pdf")
            .body(pdf);
    }

    /**
     * GET /api/v1/pf/{id}/scenarios — 프로젝트별 저장된 시나리오 목록 조회
     */
    @GetMapping("/{id}/scenarios")
    public ResponseEntity<List<PfScenario>> getScenarios(@PathVariable String id) {
        return ResponseEntity.ok(scenarioRepo.findByProjectIdOrderByCreatedAtDesc(id));
    }
}
