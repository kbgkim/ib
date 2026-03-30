package com.ib.domain.repository;

import com.ib.domain.entity.SynergyItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SynergyRepository extends JpaRepository<SynergyItem, Long> {
    List<SynergyItem> findByDealId(String dealId);
}
