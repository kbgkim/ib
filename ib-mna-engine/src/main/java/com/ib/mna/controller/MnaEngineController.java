package com.ib.mna.controller;

import com.ib.mna.service.ValuationService;
import com.ib.mna.service.ScenarioService;
import com.ib.domain.entity.SynergyItem;
import com.ib.mna.dto.ValuationBridgeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mna")
@CrossOrigin(origins = "*") // For local dev integration
public class MnaEngineController {

    @Autowired
    private ValuationService valuationService;
    
    @Autowired
    private ScenarioService scenarioService;

    @GetMapping("/synergies/{dealId}")
    public List<SynergyItem> getSynergies(@PathVariable String dealId) {
        return valuationService.getSynergiesByDeal(dealId);
    }

    @PostMapping("/calculate/synergy-npv")
    public BigDecimal calculateSynergyNPV(
            @RequestBody List<SynergyItem> items,
            @RequestParam BigDecimal wacc,
            @RequestParam int years) {
        return valuationService.calculateSynergyNPV("API-DEAL", items, wacc, years);
    }

    @PostMapping("/valuation-bridge")
    public ValuationBridgeResponse calculateValuationBridge(
            @RequestBody List<SynergyItem> items,
            @RequestParam(required = false) String scenario,
            @RequestParam(required = false) BigDecimal multiplier) {
        
        BigDecimal finalMultiplier = multiplier;
        if (finalMultiplier == null) {
            String targetScenario = (scenario != null) ? scenario : "BASE";
            finalMultiplier = scenarioService.getMultiplier(targetScenario);
        }
        
        return valuationService.calculateValuationBridge(items, finalMultiplier);
    }

    @GetMapping("/simulate/scenarios")
    public Map<String, BigDecimal> simulateScenarios(@RequestParam BigDecimal baseValue) {
        return scenarioService.generateComparison(baseValue);
    }
}
