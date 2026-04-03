package com.ib.domain.repository;

import com.ib.domain.entity.GlobalAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlobalAssetRepository extends JpaRepository<GlobalAsset, String> {
    List<GlobalAsset> findByRegion(String region);
    List<GlobalAsset> findByStatus(String status);
}
