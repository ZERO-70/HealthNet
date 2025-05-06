import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/SearchPatients.css';
import LoadingSpinner from './LoadingSpinner';
import { useLoading } from '../hooks/useLoading';

function SearchPatients() {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [treatmentDetails, setTreatmentDetails] = useState([]); // For storing treatment details
    const [selectedPatient, setSelectedPatient] = useState(null); // For showing patient name in the modal
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { loading, withLoading } = useLoading();
    const { loading: recordsLoading, withLoading: withRecordsLoading } = useLoading();

    useEffect(() => {
        // Fetch patients on page load
        fetchAllPatients();
    }, []); // Empty dependency array ensures it runs only once

    useEffect(() => {
        // Filter patients whenever the search query changes
        if (searchQuery) {
            const filtered = patients.filter((patient) =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients(patients); // Reset to all patients if search query is empty
        }
    }, [searchQuery, patients]); // Runs whenever searchQuery or patients changes

    // Scroll to top and disable background scroll when modal is open
    useEffect(() => {
        if (showModal) {
            window.scrollTo(0, 0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [showModal]);

    const fetchAllPatients = async () => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch(`https://frozen-sands-51239-b849a8d5756e.herokuapp.com/patient`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch patients.');
                }

                const data = await response.json();
                setPatients(data);
                setFilteredPatients(data); // Initialize filtered patients
            } catch (error) {
                console.error('Error fetching patients:', error);
                setErrorMessage('Failed to fetch patients.');
            }
        };
        
        withLoading(fetchPatients)();
    };

    const fetchMedicalRecords = async (patientId, patientName) => {
        const getMedicalRecords = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing. Please log in again.');
                }

                const response = await fetch(`https://frozen-sands-51239-b849a8d5756e.herokuapp.com/medical_record/patient/${patientId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch medical records.');
                }

                const data = await response.json();
                setMedicalRecords(data);
                setSelectedPatient(patientName); // Set the patient's name for the modal title

                // Fetch treatment details for each medical record
                const treatments = await Promise.all(
                    data.map(async (record) => {
                        if (record.treatement_id) {
                            const treatment = await fetchTreatmentDetails(record.treatement_id);
                            return { ...treatment, treatement_id: record.treatement_id }; // Include treatement_id for mapping
                        }
                        return null;
                    })
                );

                setTreatmentDetails(treatments.filter((treatment) => treatment !== null)); // Exclude null values
                setShowModal(true); // Open the modal
            } catch (error) {
                console.error('Error fetching medical records:', error);
                setErrorMessage('Failed to fetch medical records.');
            }
        };
        
        await withRecordsLoading(getMedicalRecords)();
    };

    const fetchTreatmentDetails = async (treatmentId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://frozen-sands-51239-b849a8d5756e.herokuapp.com/treatement/${treatmentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch treatment details.');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching treatment details:', error);
            return null;
        }
    };

    const closeModal = () => {
        setShowModal(false); // Close the modal
        setMedicalRecords([]); // Clear the records
        setTreatmentDetails([]); // Clear the treatment details
        setSelectedPatient(null); // Clear the selected patient
    };

    return (
        <div className="search-patients">
            <h2>Search Patients</h2>
            <input
                type="text"
                placeholder="Enter patient name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                disabled={loading}
            />

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {loading && <LoadingSpinner />}

            {!loading && (
                <div className="patients-list">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <div key={patient.id} className="patient-card">
                                <h3>{patient.name}</h3>
                                <p>ID: {patient.id}</p>
                                <p>Age: {patient.age}</p>
                                <p>Contact: {patient.contact_info}</p>
                                <button
                                    onClick={() => fetchMedicalRecords(patient.id, patient.name)}
                                    className="view-records-button"
                                    disabled={recordsLoading}
                                >
                                    {recordsLoading ? 'Loading...' : 'View Medical Records'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No patients found.</p>
                    )}
                </div>
            )}

            {/* Modal portal for displaying medical records and treatments */}
            {showModal && ReactDOM.createPortal(
                <div className="sp-modal-overlay" onClick={closeModal}>
                    <div className="sp-modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="sp-close-button" onClick={closeModal}>&times;</span>
                        <h2 className="sp-modal-title">Medical Records: {selectedPatient}</h2>
                        
                        {recordsLoading && <LoadingSpinner />}
                        
                        {!recordsLoading && medicalRecords.length > 0 ? (
                            <div className="medical-records-container">
                                {medicalRecords.map((record) => {
                                    const treatmentDetail = treatmentDetails.find(
                                        (treatment) => treatment.treatement_id === record.treatement_id
                                    );
                                    return (
                                        <div key={record.record_id} className="medical-record-card">
                                            <div className="record-header">
                                                <h3>{record.date} - Record #{record.record_id}</h3>
                                            </div>
                                            <div className="record-body">
                                                <div className="record-section">
                                                    <h4>Diagnosis & Vitals</h4>
                                                    <p><span className="label">Diagnosis:</span> {record.diagnosis}</p>
                                                    <p><span className="label">Blood Pressure:</span> {record.bloodpressure}</p>
                                                </div>
                                                
                                                {treatmentDetail ? (
                                                    <div className="record-section treatment-section">
                                                        <h4>Treatment Information</h4>
                                                        <p><span className="label">Treatment Name:</span> {treatmentDetail.name || 'N/A'}</p>
                                                        <p><span className="label">Administered By:</span> Doctor #{treatmentDetail.doctor_id}</p>
                                                        <p><span className="label">Department:</span> {record.department_id}</p>
                                                    </div>
                                                ) : (
                                                    <div className="record-section treatment-section">
                                                        <h4>Treatment Information</h4>
                                                        <p className="no-treatment">No treatment details available</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : !recordsLoading && (
                            <div className="no-records-message">
                                <p>No medical records found for this patient.</p>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default SearchPatients;
