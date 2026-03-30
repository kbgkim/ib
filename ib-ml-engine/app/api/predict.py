from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.store.feature_store import feature_store

router = APIRouter()

class RiskPredictRequest(BaseModel):
    dealId: str

class RiskPredictResponse(BaseModel):
    dealId: str
    mlScore: float
    confidenceLevel: str
    featuresUsed: dict

@router.post("/predict-risk", response_model=RiskPredictResponse)
async def predict_risk(request: RiskPredictRequest):
    """
    Mock ML Prediction Endpoint.
    Takes a Deal ID, fetches offline feature sets, and returns a calculated ML probability score.
    """
    features = feature_store.get_features(request.dealId)
    
    if not features:
        # For MVP, if not found, simulate a neutral default risk
        features = {"f_vdr_anomaly_score": 50.0, "historical_default_rate": 0.05}
        
    # Dummy ML Logic: Anomaly * historical rate 
    # e.g., 50.0 * 0.05 = 2.5
    vdr_score = features.get("f_vdr_anomaly_score", 50.0)
    historic_rate = features.get("historical_default_rate", 0.05)
    
    # Calculate an arbitrary ML risk score (0-100) where 100 means very risky
    raw_risk = (vdr_score * historic_rate) * 10
    ml_score = min(max(raw_risk, 0.0), 100.0) # Clamp between 0 and 100
    
    # Convert pure risk to a "safety/health" score to match Java's standard where higher is better
    # Wait, in Java, totalScore is summing 0-100 where higher is better.
    # We should return safety_score = 100 - risk_score
    safety_score = 100.0 - ml_score
    
    confidence = "HIGH" if len(features) >= 4 else "LOW"
    
    return RiskPredictResponse(
        dealId=request.dealId,
        mlScore=round(safety_score, 2),
        confidenceLevel=confidence,
        featuresUsed=features
    )
