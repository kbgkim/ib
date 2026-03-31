from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter()

class SummarizeRequest(BaseModel):
    text: str
    category: str = "GENERAL"

class SummarizeResponse(BaseModel):
    summary: str
    risk_factors: list[str]
    sentiment_score: float
    processing_time: float

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_vdr(request: SummarizeRequest):
    start_time = time.time()
    
    # Mock NLP logic for Phase 5 MVP
    # In Phase 6, this will use transformers.pipeline("summarization")
    
    text_len = len(request.text)
    category = request.category.upper()
    
    if "LEGAL" in category or "CONTRACT" in request.text.lower():
        summary = "법률 실사 문서 분석 결과, 독소 조항 및 소송 이력이 감지되었습니다."
        risk_factors = ["Change of Control 조항 존재", "미결 소송 2건", "지적재산권 분쟁 가능성"]
        sentiment = 0.45
    elif "FINANCIAL" in category or "REVENUE" in request.text.lower():
        summary = "재무 실사 결과, 수익성 지표는 양호하나 우발 채무 위험이 존재합니다."
        risk_factors = ["영업이익률 정체", "단기 차입금 비중 높음", "환율 변동 민감도 상승"]
        sentiment = 0.65
    else:
        summary = f"입력된 {text_len}자 규모의 문서를 분석했습니다. 전반적으로 중립적인 내용입니다."
        risk_factors = ["정성적 리스크 요인 분석 필요", "추가 문서 확보 권장"]
        sentiment = 0.50

    return SummarizeResponse(
        summary=summary,
        risk_factors=risk_factors,
        sentiment_score=sentiment,
        processing_time=time.time() - start_time
    )
