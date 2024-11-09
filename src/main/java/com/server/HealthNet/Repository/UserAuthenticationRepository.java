package com.server.HealthNet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.HealthNet.Model.UserAuthentication;

@Repository
public interface UserAuthenticationRepository extends JpaRepository<UserAuthentication,String>{

    UserAuthentication findByUsername(String username);
    
}
