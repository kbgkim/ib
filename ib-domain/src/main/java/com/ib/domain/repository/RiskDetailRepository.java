package com.ib.domain.repository;

import com.ib.domain.entity.RiskDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskDetailRepository extends JpaRepository<RiskDetail, Long> {
    List<RiskDetail> findByDealId(String dealId);
}
