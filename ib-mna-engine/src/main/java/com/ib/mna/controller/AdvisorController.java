package com.ib.mna.controller;

import com.ib.mna.service.AdvisorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mna/advisor")
@RequiredArgsConstructor
public class AdvisorController {

    private final AdvisorService advisorService;

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
