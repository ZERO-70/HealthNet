package com.server.HealthNet.Model;

import java.time.LocalDate;

import jakarta.persistence.Entity;

@Entity
public class Staff extends Person{
    private String proffession;
    public Staff() {
    }
    
    

    public Staff(byte[] image, String image_tyoe, String name, String gender, Integer age, LocalDate birthdate,
            String contact_info, String address, UserAuthentication userAuthentication, String proffession) {
        super(image, image_tyoe, name, gender, age, birthdate, contact_info, address, userAuthentication);
        this.proffession = proffession;
    }



    public void setProffession(String proffession) {
        this.proffession = proffession;
    }
    public String getProffession() {
        return proffession;
    }
    
}
