package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.Treatement;
@Repository
public interface TreatementRepository extends JpaRepository<Treatement,Long>{
    
}
