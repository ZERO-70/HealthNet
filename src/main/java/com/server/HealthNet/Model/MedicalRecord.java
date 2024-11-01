package com.server.HealthNet.Model;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class MedicalRecord {
    
    public MedicalRecord() {
    }
    
    public MedicalRecord(String diagnosis, String blood_pressure, LocalDate date, Patient patient,
            Department department, Treatement treatement) {
        this.diagnosis = diagnosis;
        this.blood_pressure = blood_pressure;
        this.date = date;
        this.patient = patient;
        this.department = department;
        this.treatement = treatement;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Record_id;
    private String diagnosis;
    private String blood_pressure;
    private LocalDate date;
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    @ManyToOne
    @JoinColumn(name = "treatment_id")
    private Treatement treatement;
    public Treatement getTreatement() {
        return treatement;
    }
    public void setTreatement(Treatement treatement) {
        this.treatement = treatement;
    }
    public Department getDepartment() {
        return department;
    }
    public void setDepartment(Department department) {
        this.department = department;
    }
    public Long getRecord_id() {
        return Record_id;
    }
    public void setRecord_id(Long record_id) {
        Record_id = record_id;
    }
    public String getDiagnosis() {
        return diagnosis;
    }
    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }
    public String getBlood_pressure() {
        return blood_pressure;
    }
    public void setBlood_pressure(String blood_pressure) {
        this.blood_pressure = blood_pressure;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public Patient getPatient() {
        return patient;
    }
    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
