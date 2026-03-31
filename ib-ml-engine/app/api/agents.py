from typing import List, Dict
import random

class BaseAgent:
    def __init__(self, name: str, persona: str):
        self.name = name
        self.persona = persona

    def analyze(self, project_data: Dict, market_data: Dict, peer_comments: List[Dict] = None) -> Dict:
        raise NotImplementedError

class LexAgent(BaseAgent):
    def __init__(self):
        super().__init__("Lex", "Senior Legal Counsel & Compliance Expert")

    def analyze(self, project_data: Dict, market_data: Dict, peer_comments: List[Dict] = None) -> Dict:
        carbon_price = market_data.get("carbonPrice", 18000)
        risk_level = "LOW"
        comment = "규제 환경은 안정적입니다."

        if carbon_price > 19000:
            risk_level = "MEDIUM"
            comment = f"탄소 배출권 가격 상승({carbon_price}원)으로 인해 환경 규제 준수 비용이 증가할 것으로 보입니다."
        
        # Cross-verification with Financial Expert
        if peer_comments:
            for pc in peer_comments:
                if pc['agent'] == "Quantara" and "리파이낸싱" in pc['comment']:
                    comment += " 재무팀의 리파이낸싱 계획에 따른 법적 계약 검토가 필요합니다."

        return {
            "agent": self.name,
            "persona": self.persona,
            "risk_level": risk_level,
            "comment": comment,
            "category": "LEGAL"
        }

class QuantaraAgent(BaseAgent):
    def __init__(self):
        super().__init__("Quantara", "Lead Financial Strategist & Quant")

    def analyze(self, project_data: Dict, market_data: Dict, peer_comments: List[Dict] = None) -> Dict:
        ust10y = market_data.get("ust10y", 4.3)
        credit_spread = market_data.get("creditSpread", 45)
        
        risk_level = "LOW"
        comment = "자본 비용이 안정적인 범위 내에 있습니다."

        if ust10y > 4.5:
            risk_level = "HIGH"
            comment = f"美 국채 금리 급등({ust10y}%)으로 인해 WACC 가중치가 상승하여 기업 가치 하락 압박이 큽니다."
        elif credit_spread > 50:
            risk_level = "MEDIUM"
            comment = f"신용 스프레드 확대({credit_spread}bps)로 인해 타인자본 조달 비용이 증가하고 있습니다."

        return {
            "agent": self.name,
            "persona": self.persona,
            "risk_level": risk_level,
            "comment": comment,
            "category": "FINANCIAL"
        }

class SynergyAgent(BaseAgent):
    def __init__(self):
        super().__init__("Synergy", "Operational Excellence & Supply Chain Specialist")

    def analyze(self, project_data: Dict, market_data: Dict, peer_comments: List[Dict] = None) -> Dict:
        wti = market_data.get("wti", 80)
        risk_level = "LOW"
        comment = "운영 및 공급망 효율성이 양호합니다."

        if wti > 85:
            risk_level = "MEDIUM"
            comment = f"유가 상승({wti}$)으로 인한 물류비 증가가 예상되며, 이는 매출원가(COGS)에 부정적입니다."
        
        # Cross-verification with Financial Expert
        if peer_comments:
            for pc in peer_comments:
                if pc['agent'] == "Lex" and "환경 규제" in pc['comment']:
                    comment += " 법무팀의 환경 규제 경고에 따라 친환경 설비 교체(CAPEX) 우선순위 조정을 추천합니다."

        return {
            "agent": self.name,
            "persona": self.persona,
            "risk_level": risk_level,
            "comment": comment,
            "category": "OPERATIONAL"
        }
