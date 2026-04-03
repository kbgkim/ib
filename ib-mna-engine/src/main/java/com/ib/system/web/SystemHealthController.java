package com.ib.system.web;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
public class SystemHealthController {

    @GetMapping("/health")
    public SystemHealthResponse getHealth() {
        Map<String, String> engines = new HashMap<>();
        engines.put("M&A ENGINE", "UP");
        engines.put("ML ENGINE (LightGBM)", "UP");
        engines.put("PF ENGINE (Waterfall)", "UP");
        engines.put("RISK PROPAGATION", "HEALTHY");
        
        return SystemHealthResponse.builder()
                .status("GREEN")
                .serverTime(LocalDateTime.now())
                .activeEngines(engines)
                .version("v7.0 (Production Stable)")
                .build();
    }

    @Data
    @Builder
    public static class SystemHealthResponse {
        private String status;
        private LocalDateTime serverTime;
        private Map<String, String> activeEngines;
        private String version;
    }
}
