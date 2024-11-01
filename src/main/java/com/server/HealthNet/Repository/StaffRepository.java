package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.Staff;
@Repository
public interface StaffRepository extends JpaRepository<Staff,Long>{
    
}
