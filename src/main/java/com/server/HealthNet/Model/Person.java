package com.server.HealthNet.Model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Person {
    
    public Person() {
    }

    


    public Person(byte[] image, String image_tyoe, String name, String gender, Integer age, LocalDate birthdate,
            String contact_info, String address, UserAuthentication userAuthentication) {
        this.image = image;
        this.image_tyoe = image_tyoe;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.birthdate = birthdate;
        this.contact_info = contact_info;
        this.address = address;
        this.userAuthentication = userAuthentication;
    }




    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long person_id;
    @Lob
    private byte[] image;
    private String image_tyoe;
    
    private String name;
    private String gender;
    private Integer age;
    private LocalDate birthdate;
    private String contact_info;
    private String address;
    @OneToOne(mappedBy = "person")
    private UserAuthentication userAuthentication;
    
    public UserAuthentication getUserAuthentication() {
        return userAuthentication;
    }

    public void setUserAuthentication(UserAuthentication userAuthentication) {
        this.userAuthentication = userAuthentication;
    }

    public String getImage_tyoe() {
        return image_tyoe;
    }
    public void setImage_tyoe(String image_tyoe) {
        this.image_tyoe = image_tyoe;
    }
    public Long getId() {
        return person_id;
    }
    public void setId(Long id) {
        this.person_id = id;
    }
    public byte[] getImage() {
        return image;
    }
    public void setImage(byte[] image) {
        this.image = image;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    public LocalDate getBirthdate() {
        return birthdate;
    }
    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }
    public String getContact_info() {
        return contact_info;
    }
    public void setContact_info(String contact_info) {
        this.contact_info = contact_info;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
}
