package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.Patient;
@Repository
public interface PatientRepository extends JpaRepository<Patient,Long>{
    
}
