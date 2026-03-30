package com.ib.domain.repository;

import com.ib.domain.entity.RiskMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiskMasterRepository extends JpaRepository<RiskMaster, String> {
}
