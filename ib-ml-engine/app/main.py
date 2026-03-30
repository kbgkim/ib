from fastapi import FastAPI
from app.api.predict import router as predict_router
import uvicorn

app = FastAPI(
    title="IB ML Predictive Engine (MVP)",
    description="Independent Machine Learning Microservice with Fast In-Memory Feature Store",
    version="1.0.0"
)

# Include Routers
app.include_router(predict_router, prefix="/api/v1/ml", tags=["ML Prediction"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ib-ml-engine"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
