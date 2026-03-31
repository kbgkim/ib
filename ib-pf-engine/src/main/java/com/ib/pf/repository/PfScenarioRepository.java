package com.ib.pf.repository;

import com.ib.pf.model.PfScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PfScenarioRepository extends JpaRepository<PfScenario, String> {
    List<PfScenario> findByProjectIdOrderByCreatedAtDesc(String projectId);
}
