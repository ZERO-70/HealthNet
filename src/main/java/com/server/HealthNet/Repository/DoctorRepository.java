package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.Doctor;
@Repository
public interface DoctorRepository extends JpaRepository<Doctor,Long>{
    
}
