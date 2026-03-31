from fastapi import FastAPI
from app.api.intelligence import router as intelligence_router

app = FastAPI(
    title="IB ML Predictive Engine (v3.0)",
    description="Independent Machine Learning Microservice with Fast In-Memory Feature Store & NLP Intelligence",
    version="3.0.0"
)

# Include Routers
app.include_router(predict_router, prefix="/api/v1/ml", tags=["ML Prediction"])
app.include_router(intelligence_router, prefix="/api/v1/ml", tags=["NLP Intelligence"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ib-ml-engine"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
