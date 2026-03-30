package com.ib.pf.repository;

import com.ib.pf.model.PfTranche;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PfTrancheRepository extends JpaRepository<PfTranche, Long> {
    List<PfTranche> findByProjectIdOrderBySeniority(String projectId);
}
