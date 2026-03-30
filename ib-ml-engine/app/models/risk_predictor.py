import numpy as np
import pandas as pd
import lightgbm as lgb
from typing import Dict, List, Any
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RiskPredictor:
    def __init__(self):
        self.model = None
        self.feature_names = [
            "f_ebitda_growth_3y", 
            "f_litigation_ratio", 
            "f_vdr_anomaly_score", 
            "historical_default_rate"
        ]
        self._initialize_model()

    def _initialize_model(self):
        """
        Bootstraps a synthetic dataset and trains a baseline LightGBM model.
        In a real production environment, this would load a pre-trained .txt or .joblib file.
        """
        logger.info("Initializing LightGBM Risk Predictor with synthetic bootstrapping...")
        
        # 1. Generate Synthetic Data (~1000 samples)
        np.random.seed(42)
        n_samples = 1000
        
        data = {
            "f_ebitda_growth_3y": np.random.uniform(-0.2, 0.3, n_samples),
            "f_litigation_ratio": np.random.uniform(0.0, 0.4, n_samples),
            "f_vdr_anomaly_score": np.random.uniform(0, 100, n_samples),
            "historical_default_rate": np.random.uniform(0.0, 0.1, n_samples)
        }
        
        df = pd.DataFrame(data)
        
        # Define a theoretical Risk Probability (0 to 1) 
        # Logic: Higher anomaly, higher litigation, lower ebitda growth -> Higher Risk
        df['risk_prob'] = (
            (df['f_vdr_anomaly_score'] / 100.0) * 0.4 +
            (df['f_litigation_ratio'] * 1.5) * 0.3 +
            (np.where(df['f_ebitda_growth_3y'] < 0, -df['f_ebitda_growth_3y'] * 2, 0)) * 0.2 +
            (df['historical_default_rate'] * 5) * 0.1
        )
        # Add some noise
        df['risk_prob'] = np.clip(df['risk_prob'] + np.random.normal(0, 0.05, n_samples), 0, 1)

        # 2. Train LightGBM Regressor
        # min_data_in_leaf is small because we have synthetic consistent data
        self.model = lgb.LGBMRegressor(
            n_estimators=100,
            learning_rate=0.05,
            num_leaves=31,
            verbosity=-1,
            random_state=42,
            min_data_in_leaf=20
        )
        
        self.model.fit(df[self.feature_names], df['risk_prob'])
        logger.info("LightGBM Model trained successfully.")

    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predicts Safety Score and extracts Top Risk Factors (Feature Importance).
        """
        if not self.model:
            raise RuntimeError("Model not initialized.")

        # Prepare input vector
        input_data = []
        for fn in self.feature_names:
            input_data.append(features.get(fn, 0.0))
            
        input_df = pd.DataFrame([input_data], columns=self.feature_names)
        
        # 1. Predict Risk Probability
        risk_prob = self.model.predict(input_df)[0]
        risk_prob = float(np.clip(risk_prob, 0, 1))
        
        # 2. Convert to Safety Score (100 - Risk*100)
        safety_score = round(100.0 - (risk_prob * 100.0), 2)
        
        # 3. Explainability: Top 3 Risk Factors
        # Use simple global feature importance as a proxy for local contribution in this MVP
        importances = self.model.feature_importances_
        feature_importance_map = []
        
        for i, name in enumerate(self.feature_names):
            # Map internal names to display names
            display_name = self._get_display_name(name)
            importance_val = float(importances[i])
            feature_importance_map.append({
                "factor": display_name,
                "impact": importance_val
            })
            
        # Sort by impact and take top 3
        top_factors = sorted(feature_importance_map, key=lambda x: x['impact'], reverse=True)[:3]
        
        # Normalize impact to percentages for display
        total_impact = sum(f['impact'] for f in top_factors)
        for f in top_factors:
            f['weight'] = round((f['impact'] / total_impact) * 100, 1) if total_impact > 0 else 33.3

        return {
            "mlScore": safety_score,
            "riskProbability": round(risk_prob, 4),
            "topFactors": top_factors
        }

    def _get_display_name(self, feature_id: str) -> str:
        mapping = {
            "f_ebitda_growth_3y": "EBITDA 성장성 (3년)",
            "f_litigation_ratio": "소송 리스크 비중",
            "f_vdr_anomaly_score": "VDR 데이터 이상 징후",
            "historical_default_rate": "과거 부실 발생률"
        }
        return mapping.get(feature_id, feature_id)

# Singleton instance for the app
predictor = RiskPredictor()
