package com.ib.risk.web;

import com.ib.domain.entity.GlobalAsset;
import com.ib.domain.repository.GlobalAssetRepository;
import com.ib.risk.service.RiskPropagationService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/monitoring")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For local dev
public class GlobalMonitoringController {

    private final GlobalAssetRepository assetRepository;
    private final RiskPropagationService propagationService;

    @GetMapping("/assets")
    @Cacheable("globalAssets")
    public List<GlobalAsset> getAllAssets() {
        return assetRepository.findAll();
    }

    @GetMapping("/simulation")
    public List<RiskPropagationService.PropagationResult> simulateRisk(
            @RequestParam String sourceId,
            @RequestParam(defaultValue = "10.0") double shockAmount) {
        return propagationService.simulatePropagation(sourceId, shockAmount);
    }
}
