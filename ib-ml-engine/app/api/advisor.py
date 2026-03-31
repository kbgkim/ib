from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from .agents import LexAgent, QuantaraAgent, SynergyAgent

router = APIRouter()

class AdvisorRequest(BaseModel):
    project_id: str
    project_data: Dict
    market_data: Dict

class AdvisorResponse(BaseModel):
    project_id: str
    status: str
    timestamp: str
    summary: str
    individual_reports: List[Dict]

@router.post("/analyze", response_model=AdvisorResponse)
async def analyze_project(req: AdvisorRequest):
    try:
        lex = LexAgent()
        quantara = QuantaraAgent()
        synergy = SynergyAgent()

        # Step 1: Broad Financial Analysis
        report_q = quantara.analyze(req.project_data, req.market_data)

        # Step 2: Specialized Analysis with Financial Context
        report_l = lex.analyze(req.project_data, req.market_data, [report_q])
        report_s = synergy.analyze(req.project_data, req.market_data, [report_q, report_l])

        reports = [report_q, report_l, report_s]

        # Step 3: Synthesis (Coordinator Logic)
        highest_risk = "LOW"
        risk_priorities = {"LOW": 1, "MEDIUM": 2, "HIGH": 3}
        for r in reports:
            if risk_priorities[r['risk_level']] > risk_priorities[highest_risk]:
                highest_risk = r['risk_level']

        summary = f"신규 시장 지표 변화에 따라 프로젝트의 전체 리스크 등급이 {highest_risk}로 조정되었습니다. "
        
        # Mapping Actions to Experts
        for r in reports:
            if r['agent'] == 'Quantara' and r['risk_level'] == 'HIGH':
                r['action_link'] = {"type": "SET_RATE", "value": 4.5, "label": "리파이낸싱 실행 (4.5%)"}
            elif r['agent'] == 'Lex' and r['risk_level'] == 'MEDIUM':
                r['action_link'] = {"type": "AUDIT_VDR", "value": 0, "label": "계약 위반 법률 실사"}
            elif r['agent'] == 'Synergy' and r['risk_level'] == 'MEDIUM':
                r['action_link'] = {"type": "CAPEX_REDUCTION", "value": 200, "label": "운영비용 200M 절감"}

        if highest_risk == "HIGH":
            summary += "금리 급변에 따른 자본 조달 리스크가 심각하므로 최우선적으로 리파이낸싱 또는 자본 수납 전략이 필요합니다."
        elif highest_risk == "MEDIUM":
            summary += "환경 규제 비용 상승 및 공급망 변동성에 대한 모니터링이 필요합니다."
        else:
            summary += "현재 매크로 지표는 프로젝트 밸류에이션에 긍정적인 영향을 주고 있습니다."

        return AdvisorResponse(
            project_id=req.project_id,
            status="SUCCESS",
            timestamp=datetime.now().isoformat(),
            summary=summary,
            individual_reports=reports
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
