package com.ib.mna.controller;

import com.ib.mna.service.AdvisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mna/advisor")
public class AdvisorController {

    @Autowired
    private AdvisorService advisorService;

    @PostMapping("/analyze/{dealId}")
    public AdvisorService.AdvisorResponse getAnalysis(@PathVariable String dealId, @RequestBody Map<String, Object> body) {
        // Simulating project context fetch
        Map<String, Object> projectData = new HashMap<>();
        projectData.put("dealId", dealId);
        projectData.put("sector", "Infrastructure");
        projectData.put("esg_rating", "B+");
        
        return advisorService.getStrategicAdvice(dealId, projectData);
    }
}
