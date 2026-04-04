package com.ib.mna.service;

import com.ib.mna.dto.MarketDataResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.atomic.AtomicReference;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class MarketDataService {

    private final AtomicReference<MarketDataResponse> currentMarketData = new AtomicReference<>();
    private final Random random = new Random();
    private RestTemplate restTemplate = new RestTemplate();
    private static final String FX_API_URL = "https://www.frankfurter.app/latest?from=USD&to=KRW";
    private static final BigDecimal FALLBACK_FX_RATE = new BigDecimal("1510.50");

    @PostConstruct
    public void init() {
        BigDecimal initialFxRate = fetchRealTimeRate();
        log.info("MarketDataService initialized with USDKRW: {}", initialFxRate);

        // Initial values (v4.1 Baseline with Real-time API)
        currentMarketData.set(MarketDataResponse.builder()
                .ust10y(new BigDecimal("4.32"))
                .kst3y(new BigDecimal("3.45"))
                .usdkrw(initialFxRate)
                .creditSpread(new BigDecimal("45.0"))
                .carbonPrice(new BigDecimal("18500"))
                .wti(new BigDecimal("81.20"))
                .covenantStatus("OK") // Initial status
                .timestamp(LocalDateTime.now())
                .build());
    }

    @SuppressWarnings({"unchecked", "null"})
    private BigDecimal fetchRealTimeRate() {
        try {
            log.info("Fetching real-time exchange rate from: {}", FX_API_URL);
            Map<String, Object> response = restTemplate.getForObject(FX_API_URL, Map.class);
            if (response != null && response.containsKey("rates")) {
                Map<String, Object> rates = (Map<String, Object>) response.get("rates");
                Object krwRate = rates.get("KRW");
                if (krwRate != null) {
                    BigDecimal rate = new BigDecimal(krwRate.toString()).setScale(2, RoundingMode.HALF_UP);
                    log.info("Successfully fetched real-time rate: {}", rate);
                    return rate;
                }
            }
            log.warn("API response format invalid or missing rates. Using fallback: {}", FALLBACK_FX_RATE);
        } catch (Exception e) {
            log.error("Failed to fetch real-time exchange rate: {}. Using fallback: {}", e.getMessage(), FALLBACK_FX_RATE);
        }
        return FALLBACK_FX_RATE;
    }

    public MarketDataResponse getLatestData() {
        return currentMarketData.get();
    }

    @Scheduled(fixedRate = 10000) // 10 seconds
    public void simulateMarketMovement() {
        MarketDataResponse prev = currentMarketData.get();
        
        // Dynamic fluctuation (+/- 0.1% ~ 0.5%)
        MarketDataResponse next = MarketDataResponse.builder()
                .ust10y(adjust(prev.getUst10y(), 0.01))
                .kst3y(adjust(prev.getKst3y(), 0.01))
                .usdkrw(adjust(prev.getUsdkrw(), 2.0)) // Max 2 KRW move
                .creditSpread(adjust(prev.getCreditSpread(), 0.5))
                .carbonPrice(adjust(prev.getCarbonPrice(), 100))
                .wti(adjust(prev.getWti(), 0.3))
                .timestamp(LocalDateTime.now())
                .build();

        next.setCovenantStatus(checkCovenantStatus(next));
        currentMarketData.set(next);
        log.debug("Market Data Updated: {}", next);
    }

    private String checkCovenantStatus(MarketDataResponse data) {
        double yield = data.getUst10y().doubleValue();
        double spread = data.getCreditSpread().doubleValue();

        if (yield > 4.65 || spread > 58) {
            return "BREACH";
        } else if (yield > 4.45 || spread > 52) {
            return "WARNING";
        }
        return "OK";
    }

    private BigDecimal adjust(BigDecimal val, double range) {
        double delta = (random.nextDouble() * 2 - 1) * range;
        return val.add(BigDecimal.valueOf(delta)).setScale(2, RoundingMode.HALF_UP);
    }
}
