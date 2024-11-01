package com.server.HealthNet.Model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
@Entity
public class Doctor extends Person{
    public Doctor() {
    }
    
    
    


    public Doctor(byte[] image, String image_tyoe, String name, String gender, Integer age, LocalDate birthdate,
            String contact_info, String address, UserAuthentication userAuthentication, String specialization,
            Avalibility avalibility, List<Appointment> appointments, List<Treatement> treatements) {
        super(image, image_tyoe, name, gender, age, birthdate, contact_info, address, userAuthentication);
        Specialization = specialization;
        this.avalibility = avalibility;
        this.appointments = appointments;
        this.treatements = treatements;
    }





    private String Specialization;
    @OneToOne
    @JoinColumn(name = "avalibility_id")
    private Avalibility avalibility;
    public String getSpecialization() {
        return Specialization;
    }
    public void setSpecialization(String specialization) {
        Specialization = specialization;
    }
    public Avalibility getAvalibility() {
        return avalibility;
    }
    public void setAvalibility(Avalibility avalibility) {
        this.avalibility = avalibility;
    }

    @OneToMany(mappedBy = "doctor",cascade = CascadeType.ALL)
    private List<Appointment> appointments;
    public List<Appointment> getAppointment() {
        return appointments;
    }
    public void setAppointment(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    @OneToMany(mappedBy = "doctor",cascade = CascadeType.ALL)
    private List<Treatement> treatements;
    public List<Treatement> getTreatement() {
        return treatements;
    }
    public void setTreatement(List<Treatement> treatements) {
        this.treatements = treatements;
    }
}
