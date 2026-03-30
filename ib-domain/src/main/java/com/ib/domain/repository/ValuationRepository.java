package com.ib.domain.repository;

import com.ib.domain.entity.ValuationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ValuationRepository extends JpaRepository<ValuationResult, Long> {
    List<ValuationResult> findByDealId(String dealId);
}
