package com.ib.pf.repository;

import com.ib.pf.model.PfCashFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PfCashFlowRepository extends JpaRepository<PfCashFlow, Long> {
    List<PfCashFlow> findByProjectIdOrderByProjectYear(String projectId);
}
