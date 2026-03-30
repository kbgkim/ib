from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
import logging

from app.store.feature_store import feature_store
from app.models.risk_predictor import predictor

logger = logging.getLogger(__name__)
router = APIRouter()

class RiskPredictRequest(BaseModel):
    dealId: str

class RiskFactor(BaseModel):
    factor: str
    impact: float
    weight: float

class RiskPredictResponse(BaseModel):
    dealId: str
    mlScore: float
    riskProbability: float
    confidenceLevel: str
    topFactors: List[RiskFactor]
    featuresUsed: dict

@router.post("/predict-risk", response_model=RiskPredictResponse)
async def predict_risk(request: RiskPredictRequest):
    """
    ML Prediction Endpoint using LightGBM.
    Fetches offline feature sets, runs LightGBM inference, and returns 
    Safety Score with Top Risk Factors.
    """
    deal_id = request.dealId
    features = feature_store.get_features(deal_id)
    
    if not features:
        # For new deals, if not found, use a baseline features
        # In production, this would trigger an asynchronous feature engineering pipeline
        features = {
            "f_vdr_anomaly_score": 50.0, 
            "historical_default_rate": 0.05,
            "f_ebitda_growth_3y": 0.05,
            "f_litigation_ratio": 0.1
        }
        
    try:
        # Run LightGBM Inference via RiskPredictor
        prediction = predictor.predict(features)
        
        confidence = "HIGH" if len(features) >= 4 else "LOW"
        
        return RiskPredictResponse(
            dealId=deal_id,
            mlScore=prediction["mlScore"],
            riskProbability=prediction["riskProbability"],
            confidenceLevel=confidence,
            topFactors=[RiskFactor(**f) for f in prediction["topFactors"]],
            featuresUsed=features
        )
    except Exception as e:
        logger.error(f"Prediction failed for {deal_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"ML Prediction Engine Error: {str(e)}")

@router.get("/model-info")
async def get_model_info():
    """Returns model health and version information."""
    return {
        "model_type": "LightGBM Regressor",
        "version": "1.6.1-LGBM",
        "status": "HEALTHY",
        "features_tracked": predictor.feature_names
    }
