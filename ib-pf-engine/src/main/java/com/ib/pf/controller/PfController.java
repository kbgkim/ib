package com.ib.pf.controller;

import com.ib.pf.dto.PfMetricsResponse;
import com.ib.pf.dto.PfSensitivityResponse;
import com.ib.pf.dto.PfWaterfallResponse;
import com.ib.pf.model.PfProject;
import com.ib.pf.repository.PfProjectRepository;
import com.ib.pf.service.PfMetricsEngine;
import com.ib.pf.service.PfSensitivityEngine;
import com.ib.pf.service.PfWaterfallEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pf")
@CrossOrigin(origins = "http://localhost:5173")
public class PfController {

    private final PfProjectRepository projectRepo;
    private final PfMetricsEngine metricsEngine;
    private final PfWaterfallEngine waterfallEngine;
    private final PfSensitivityEngine sensitivityEngine;

    public PfController(PfProjectRepository projectRepo,
                        PfMetricsEngine metricsEngine,
                        PfWaterfallEngine waterfallEngine,
                        PfSensitivityEngine sensitivityEngine) {
        this.projectRepo = projectRepo;
        this.metricsEngine = metricsEngine;
        this.waterfallEngine = waterfallEngine;
        this.sensitivityEngine = sensitivityEngine;
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
}
