from fastapi import FastAPI
from app.api.predict import router as predict_router
from app.api.intelligence import router as intelligence_router
from app.api.advisor import router as advisor_router

app = FastAPI(
    title="IB ML Predictive Engine (v4.0)",
    description="Independent Machine Learning Microservice with Multi-Agent Strategic Advisory",
    version="4.0.0"
)

# Include Routers
app.include_router(predict_router, prefix="/api/v1/ml", tags=["ML Prediction"])
app.include_router(intelligence_router, prefix="/api/v1/ml", tags=["NLP Intelligence"])
app.include_router(advisor_router, prefix="/api/v1/ml/advisor", tags=["Multi-Agent Advisor"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ib-ml-engine"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
