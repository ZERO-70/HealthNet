package com.server.HealthNet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.HealthNet.Model.UserAuthentication;
import com.server.HealthNet.Repository.UserAuthenticationRepository;
@Service
public class UserAuthenticationService {
    @Autowired
    private UserAuthenticationRepository userAuthenticationRepository;

    public List<UserAuthentication> findAll_S(){
        List<UserAuthentication> users = userAuthenticationRepository.findAll();
        if (users == null){
            System.out.println("-------------------------- no user found ---------------------------");
        }
        return users;
    }
    public UserAuthentication findByUsername(String username){
        return userAuthenticationRepository.findByUsername(username);
    }
}
