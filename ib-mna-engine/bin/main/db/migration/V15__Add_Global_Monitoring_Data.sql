-- Global Assets
INSERT INTO ib.T_IB_GLOBAL_ASSET (id, name, asset_type, region, latitude, longitude, valuation, base_risk_score, status) VALUES
('ASSET_NY_DATA', 'Manhattan Tech Hub', 'TECH', 'AMER', 40.7128, -74.0060, 1200000000, 15.5, 'ACTIVE'),
('ASSET_LDN_PORT', 'London Strategic Port', 'INFRA', 'EMEA', 51.5074, -0.1278, 2500000000, 22.0, 'ACTIVE'),
('ASSET_SG_SOLAR', 'Singapore Solar Park', 'RENEWABLES', 'ASIA', 1.3521, 103.8198, 850000000, 12.0, 'ACTIVE'),
('ASSET_SA_OIL', 'Riyadh Energy Complex', 'ENERGY', 'EMEA', 24.7136, 46.6753, 5000000000, 35.0, 'WARNING'),
('ASSET_KR_CHIP', 'Seoul Semiconductor Plant', 'TECH', 'ASIA', 37.5665, 126.9780, 4200000000, 18.5, 'ACTIVE');

-- Risk Propagation Links
INSERT INTO ib.T_IB_ASSET_RISK_LINK (source_asset_id, target_asset_id, propagation_weight, link_type, description) VALUES
('ASSET_SA_OIL', 'ASSET_LDN_PORT', 0.65, 'SUPPLY_CHAIN', 'Energy dependency for logistics'),
('ASSET_SA_OIL', 'ASSET_KR_CHIP', 0.45, 'SUPPLY_CHAIN', 'Energy costs impact production'),
('ASSET_NY_DATA', 'ASSET_KR_CHIP', 0.35, 'FINANCIAL', 'Global tech sector correlation'),
('ASSET_SG_SOLAR', 'ASSET_KR_CHIP', 0.25, 'INFRASTRUCTURE', 'Regional grid stability');
