package com.server.HealthNet.Model;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Department {

    public Department() {
    }
    
    public Department(List<MedicalRecord> medicalRecords, List<Treatement> treatements, List<Inventory> inventories,
            String name) {
        this.medicalRecords = medicalRecords;
        this.treatements = treatements;
        this.inventories = inventories;
        this.name = name;
    }

    @OneToMany(mappedBy = "department",cascade = CascadeType.ALL)
    private List<MedicalRecord> medicalRecords;
    @OneToMany(mappedBy = "department",cascade = CascadeType.ALL)
    private List<Treatement> treatements;

    @OneToMany(mappedBy = "department",cascade = CascadeType.ALL)
    private List<Inventory> inventories;

    public List<Inventory> getInventories() {
        return inventories;
    }

    public void setInventories(List<Inventory> inventories) {
        this.inventories = inventories;
    }

    public List<Treatement> getTreatements() {
        return treatements;
    }
    public void setTreatements(List<Treatement> treatements) {
        this.treatements = treatements;
    }
    public List<MedicalRecord> getMedicalRecords() {
        return medicalRecords;
    }
    public void setMedicalRecords(List<MedicalRecord> medicalRecords) {
        this.medicalRecords = medicalRecords;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long department_id;
    private String name;
    public Long getDepartment_id() {
        return department_id;
    }
    public void setDepartment_id(Long department_id) {
        this.department_id = department_id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
