package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Long>{
    
}