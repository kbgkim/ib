from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np

router = APIRouter()

class RebalanceRequest(BaseModel):
    portfolio_id: str
    total_aum: float                   # Current Total AUM in Billion USD (e.g., 4.2)
    current_weights: Dict[str, float]  # e.g., {"RENEWABLES": 42.0, "INFRA": 18.0, "TECH": 40.0}
    asset_risks: Dict[str, float]      # e.g., {"RENEWABLES": 25.0, "INFRA": 15.0, "TECH": 45.0}
    scenario: str                      # NORMAL, HIKE, VOLATILE, SHOCK
    goal: Optional[str] = "BALANCED"   # MIN_RISK, BALANCED
    fixed_fee_per_trade: float = 0.0   # Fixed fee per trade in Million USD (e.g., 0.01 for $10k)
    variable_fee_rate: float = 0.0015  # Default 0.15%

class RebalanceResponse(BaseModel):
    portfolio_id: str
    recommended_weights: Dict[str, float]
    predicted_risk_reduction: float
    total_fees: float                  # Million USD
    estimated_tax: float               # Million USD
    net_impact_aum: float              # Million USD (Total Cost)
    summary: str

@router.post("/rebalance", response_model=RebalanceResponse)
async def recommend_rebalance(req: RebalanceRequest):
    """
    AI Portfolio Rebalancing Optimizer with Tax & Cost Simulation.
    Features: Tax Loss Harvesting (Netting) and Fixed/Variable Fee options.
    """
    try:
        assets = list(req.current_weights.keys())
        total_aum_m = req.total_aum * 1000.0  # Convert Billion to Million
        
        # Scenario Multipliers
        multipliers = {
            "NORMAL": {"RENEWABLES": 1.0, "INFRA": 1.0, "TECH": 1.0},
            "HIKE": {"RENEWABLES": 0.8, "INFRA": 1.1, "TECH": 0.7},
            "VOLATILE": {"RENEWABLES": 1.0, "INFRA": 1.2, "TECH": 0.8},
            "SHOCK": {"RENEWABLES": 1.5, "INFRA": 0.7, "TECH": 0.6}
        }
        
        scenario_mult = multipliers.get(req.scenario, multipliers["NORMAL"])
        
        # 1. AI Recommendation Engine
        scores = {}
        for a in assets:
            risk = req.asset_risks.get(a, 30.0)
            mult = scenario_mult.get(a, 1.0)
            scores[a] = (100.0 / (risk + 1.0)) * mult
            
        total_score = sum(scores.values())
        rec_weights = {a: round((scores[a] / total_score) * 100, 1) for a in assets}
        
        # Balance rounding
        diff = 100.0 - sum(rec_weights.values())
        if assets:
            rec_weights[assets[0]] = round(rec_weights[assets[0]] + diff, 1)
            
        # 2. Risk Reduction Calc
        current_weighted_risk = sum(req.current_weights[a] * req.asset_risks.get(a, 30) for a in assets) / 100.0
        rec_weighted_risk = sum(rec_weights[a] * req.asset_risks.get(a, 30) for a in assets) / 100.0
        reduction = max(0, current_weighted_risk - rec_weighted_risk)

        # 3. Transaction Cost & Tax Simulation
        total_variable_fee = 0.0
        trades_count = 0
        total_realized_gain = 0.0
        total_realized_loss = 0.0

        # Simulated Profit/Loss Ratios per Asset (Compared to cost basis)
        # Tech: Large Gain, Renewables: Small Gain, Infra: Slight Loss (Simulated Environment)
        pnl_ratios = {"TECH": 0.4, "RENEWABLES": 0.1, "INFRA": -0.05}

        for a in assets:
            weight_diff = rec_weights[a] - req.current_weights[a]
            trade_amount = abs(weight_diff) * total_aum_m / 100.0
            
            if trade_amount > 0.1:  # Only count significant trades
                trades_count += 1
                total_variable_fee += trade_amount * req.variable_fee_rate
                
                # Tax Simulation logic (Only for SELLs)
                if weight_diff < 0:
                    sold_amount = trade_amount
                    pnl_ratio = pnl_ratios.get(a, 0.1)
                    if pnl_ratio > 0:
                        total_realized_gain += sold_amount * (pnl_ratio / (1 + pnl_ratio))
                    else:
                        total_realized_loss += sold_amount * abs(pnl_ratio)

        # Tax Loss Harvesting (Netting)
        net_taxable_gain = max(0, total_realized_gain - total_realized_loss)
        estimated_tax = net_taxable_gain * 0.22
        
        fixed_fees = trades_count * req.fixed_fee_per_trade
        total_fees = total_variable_fee + fixed_fees
        net_impact = total_fees + estimated_tax

        # 4. Summary & Strategy Insight
        summary = f"[{req.scenario}] 기반 리벨런싱입니다. "
        if total_realized_loss > 0 and total_realized_gain > 0:
            summary += f"손실 자산({total_realized_loss:.1f}M)을 전략적으로 매각하여 과세 이익을 상쇄(Tax Netting)하였습니다. "
        
        summary += f"총 실행 비용은 {net_impact:.2f}M USD 입니다."

        return RebalanceResponse(
            portfolio_id=req.portfolio_id,
            recommended_weights=rec_weights,
            predicted_risk_reduction=round(reduction, 2),
            total_fees=round(total_fees, 4),
            estimated_tax=round(estimated_tax, 4),
            net_impact_aum=round(net_impact, 4),
            summary=summary
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
