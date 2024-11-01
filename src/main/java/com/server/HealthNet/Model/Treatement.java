package com.server.HealthNet.Model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
@Entity
public class Treatement {
    
    public Treatement() {
    }
    
    public Treatement(String name, Doctor doctor, List<MedicalRecord> medicalRecords, Department department) {
        this.name = name;
        this.doctor = doctor;
        this.medicalRecords = medicalRecords;
        this.department = department;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long treatement_id;
    private String name;
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToMany(mappedBy = "treatement",cascade = CascadeType.ALL)
    private List<MedicalRecord> medicalRecords;
    
    public List<MedicalRecord> getMedicalRecords() {
        return medicalRecords;
    }
    public void setMedicalRecords(List<MedicalRecord> medicalRecords) {
        this.medicalRecords = medicalRecords;
    }

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    public Long getTreatement_id() {
        return treatement_id;
    }
    public void setTreatement_id(Long treatement_id) {
        this.treatement_id = treatement_id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Doctor getDoctor() {
        return doctor;
    }
    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
    public Department getDepartment() {
        return department;
    }
    public void setDepartment(Department department) {
        this.department = department;
    }
}
