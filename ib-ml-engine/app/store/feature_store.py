from typing import Dict, Any

class MockFeatureStore:
    def __init__(self):
        # In-memory dict simulating Redis or Feast offline store
        self._store: Dict[str, Dict[str, Any]] = {
            "DEAL-001": {
                "f_ebitda_growth_3y": 0.15,
                "f_litigation_ratio": 0.05,
                "f_vdr_anomaly_score": 12.5,
                "historical_default_rate": 0.01
            },
            "DEAL-2026-TEST": {
                "f_ebitda_growth_3y": -0.05,
                "f_litigation_ratio": 0.20,
                "f_vdr_anomaly_score": 85.0,
                "historical_default_rate": 0.08
            }
        }
        
    def get_features(self, deal_id: str) -> Dict[str, Any]:
        """Fetch feature vector for a given deal ID."""
        return self._store.get(deal_id, {})

# Singleton instance
feature_store = MockFeatureStore()
