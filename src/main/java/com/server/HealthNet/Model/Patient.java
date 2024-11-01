package com.server.HealthNet.Model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Patient extends Person{
    
    
    public Patient(byte[] image, String image_tyoe, String name, String gender, Integer age, LocalDate birthdate,
            String contact_info, String address, UserAuthentication userAuthentication, String height, String weight,
            List<Appointment> appointment, List<MedicalRecord> medicalRecords) {
        super(image, image_tyoe, name, gender, age, birthdate, contact_info, address, userAuthentication);
        this.height = height;
        this.weight = weight;
        this.appointment = appointment;
        this.medicalRecords = medicalRecords;
    }
    public Patient() {
    }
    private String height;
    private String weight;
    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL)
    private List<Appointment> appointment;

    
    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL)
    private List<MedicalRecord> medicalRecords;

    public List<MedicalRecord> getMedicalRecords() {
        return medicalRecords;
    }
    public void setMedicalRecords(List<MedicalRecord> medicalRecords) {
        this.medicalRecords = medicalRecords;
    }
    public String getHeight() {
        return height;
    }
    public void setHeight(String height) {
        this.height = height;
    }
    public String getWeight() {
        return weight;
    }
    public void setWeight(String weight) {
        this.weight = weight;
    }
    public List<Appointment> getAppointment() {
        return appointment;
    }
    public void setAppointment(List<Appointment> appointment) {
        this.appointment = appointment;
    }
}
