package com.ib.domain.repository;

import com.ib.domain.entity.HedgingStrategy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HedgingStrategyRepository extends JpaRepository<HedgingStrategy, Long> {
    List<HedgingStrategy> findByAssetId(String assetId);
    List<HedgingStrategy> findByStatus(String status);
}
