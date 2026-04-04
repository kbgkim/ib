package com.ib.mna.controller;

import com.ib.mna.service.AdvisorService;
import com.ib.mna.service.MnaReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mna/report")
@RequiredArgsConstructor
public class ReportController {

    private final MnaReportService reportService;
    private final AdvisorService advisorService;

    @GetMapping("/download/{dealId}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable String dealId) {
        // Mock project data fetch
        Map<String, Object> projectData = new HashMap<>();
        projectData.put("dealId", dealId);
        projectData.put("sector", "Energy/Infrastructure");
        projectData.put("target", "Project Titan");

        // Fetch AI Advisor insights
        AdvisorService.AdvisorResponse advisor = advisorService.getStrategicAdvice(dealId, projectData);

        // Generate PDF
        byte[] pdfContent = reportService.generateIntelligenceReport(dealId, projectData, advisor);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Aura_Intelligence_" + dealId + ".pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfContent);
    }
}
