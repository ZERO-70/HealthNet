package com.server.HealthNet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.HealthNet.Model.Person;
import com.server.HealthNet.Repository.PersonRepository;


@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;
    public String addPerson_S(Person person){
        person.toString();
        System.out.println(personRepository.save(person));
        return "added the user";
    }
    public List<Person> findAll_S(){
        List<Person> persons = personRepository.findAll();
        return persons;
    }
}
