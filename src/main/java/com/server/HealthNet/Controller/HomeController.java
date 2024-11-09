package com.server.HealthNet.Controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.HealthNet.Model.Person;
import com.server.HealthNet.Model.UserAuthentication;
import com.server.HealthNet.Service.PersonService;
import com.server.HealthNet.Service.UserAuthenticationService;
import com.server.HealthNet.Model.Role;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class HomeController {
    
    @Autowired
    private UserAuthenticationService userAuthenticationService;
    @Autowired
    private PersonService personService;

    @GetMapping("/")
    public Role Home(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
        String username = authentication.getName();
        UserAuthentication user = userAuthenticationService.findByUsername(username);
        return user.getRole();
    }
    @GetMapping("/getUsers")
    public List<UserAuthentication> giving_users(){
        List<UserAuthentication> users = userAuthenticationService.findAll_S();
        return users;
    }

    @PostMapping("/person")
    public String addPerson(@RequestBody Person person){
        System.out.println("controller      "+person.toString());
        return personService.addPerson_S(person);
    }

    @GetMapping("/person")
    public List<Person> giving_persons(){
        List<Person> users = personService.findAll_S();
        return users;
    }
}
