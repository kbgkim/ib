package com.ib.domain.repository;

import com.ib.domain.entity.AssetRiskLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRiskLinkRepository extends JpaRepository<AssetRiskLink, Long> {
    List<AssetRiskLink> findBySourceAssetId(String sourceAssetId);
    List<AssetRiskLink> findByTargetAssetId(String targetAssetId);
}
