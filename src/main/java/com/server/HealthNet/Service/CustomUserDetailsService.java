package com.server.HealthNet.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.server.HealthNet.Model.CustomUserDetails;
import com.server.HealthNet.Model.UserAuthentication;
import com.server.HealthNet.Repository.UserAuthenticationRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{


    private UserAuthenticationRepository userAuthenticationRepository;
    
    public CustomUserDetailsService(UserAuthenticationRepository userAuthenticationRepository) {
        this.userAuthenticationRepository = userAuthenticationRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserAuthentication user = userAuthenticationRepository.findByUsername(username);
        if (user == null){
            throw new UsernameNotFoundException("user not found");
        }
        System.out.println("user found : "+user.getPassword());
        return new CustomUserDetails(user);
    }
    
}
