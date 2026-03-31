package com.ib.mna.controller;

import com.ib.mna.dto.MarketDataResponse;
import com.ib.mna.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/market")
public class MarketDataController {

    @Autowired
    private MarketDataService marketDataService;

    @GetMapping("/latest")
    public MarketDataResponse getLatestData() {
        return marketDataService.getLatestData();
    }
}
