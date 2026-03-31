package com.ib.mna.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class MarketDataResponse {
    private BigDecimal ust10y;       // US 10Y Treasury Yield (%)
    private BigDecimal kst3y;       // KR 3Y Treasury Yield (%)
    private BigDecimal usdkrw;      // USD/KRW Exchange Rate
    private BigDecimal creditSpread; // AA-BBB Credit Spread (bps)
    private BigDecimal carbonPrice;  // Carbon ETS Price (KRW)
    private BigDecimal wti;         // WTI Oil Price (USD)
    private String covenantStatus;  // OK | WARNING | BREACH
    private LocalDateTime timestamp;
}
