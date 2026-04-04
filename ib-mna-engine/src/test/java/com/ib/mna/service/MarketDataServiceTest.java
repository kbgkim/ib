package com.ib.mna.service;

import com.ib.mna.dto.MarketDataResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.web.client.RestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MarketDataServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private MarketDataService marketDataService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testInitWithApiSuccess() {
        // Mock API Response
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> rates = new HashMap<>();
        rates.put("KRW", 1520.50);
        response.put("rates", rates);

        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenReturn(response);

        marketDataService.init();

        MarketDataResponse data = marketDataService.getLatestData();
        assertEquals(0, new BigDecimal("1520.50").compareTo(data.getUsdkrw()), 
            "Expected 1520.50 but got " + data.getUsdkrw());
    }

    @Test
    void testInitWithApiFailureFallback() {
        // Mock API Failure
        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenThrow(new RuntimeException("API Error"));

        marketDataService.init();

        MarketDataResponse data = marketDataService.getLatestData();
        assertEquals(new BigDecimal("1510.50"), data.getUsdkrw()); // FALLBACK_FX_RATE
    }
}
