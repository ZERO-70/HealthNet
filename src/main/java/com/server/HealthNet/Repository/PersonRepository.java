package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.Person;
@Repository
public interface PersonRepository extends JpaRepository<Person,Long>{
    
}
