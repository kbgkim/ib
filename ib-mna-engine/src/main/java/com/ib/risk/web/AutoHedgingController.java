package com.ib.risk.web;

import com.ib.domain.entity.HedgingStrategy;
import com.ib.risk.service.AutoHedgingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hedging")
@RequiredArgsConstructor
public class AutoHedgingController {

    private final AutoHedgingService autoHedgingService;

    @GetMapping("/recommendations/{assetId}")
    public List<HedgingStrategy> getRecommendations(@PathVariable String assetId, @RequestParam double risk) {
        return autoHedgingService.generateRecommendations(assetId, risk);
    }

    @PostMapping("/execute/{strategyId}")
    public HedgingStrategy execute(@PathVariable Long strategyId) {
        return autoHedgingService.executeStrategy(strategyId);
    }
}
