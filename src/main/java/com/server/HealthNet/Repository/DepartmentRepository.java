package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.Department;
@Repository
public interface DepartmentRepository extends JpaRepository<Department,Long>{
    
}