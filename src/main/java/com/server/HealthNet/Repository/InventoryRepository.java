package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.Inventory;
@Repository
public interface InventoryRepository extends JpaRepository<Inventory,Long>{
    
}
