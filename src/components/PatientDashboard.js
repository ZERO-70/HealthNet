import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiFileText, FiAlertCircle, FiInfo, FiMessageSquare, FiCheck, FiPhone } from 'react-icons/fi';
import '../styles/PatientDashboard.css';
import LoadingSpinner from './LoadingSpinner';

const API_BASE_URL = 'https://frozen-sands-51239-b849a8d5756e.herokuapp.com';

const PatientDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [patientInfo, setPatientInfo] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [healthMetrics, setHealthMetrics] = useState({
        height: '',
        weight: '',
        bloodPressure: '',
        heartRate: '',
        respiratoryRate: '',
        temperature: '',
        oxygenSaturation: ''
    });
    const [medications, setMedications] = useState([]);
    const [medicalAdvice, setMedicalAdvice] = useState(null);
    const [error, setError] = useState('');

    // Helper to safely capitalize status strings
    const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('Authentication token missing');
                const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

                // Fetch patient info
                const patientResponse = await fetch(`${API_BASE_URL}/patient/getmine`, { headers });
                if (!patientResponse.ok) throw new Error('Failed to fetch patient information');
                const patientData = await patientResponse.json();
                setPatientInfo(patientData);

                // Fetch medical advice suggestions
                try {
                    const suggestionsResponse = await fetch(`${API_BASE_URL}/suggestion/getmine`, { headers });
                    if (suggestionsResponse.ok) {
                        const suggestionsData = await suggestionsResponse.json();
                        if (Array.isArray(suggestionsData) && suggestionsData.length) {
                            const sorted = suggestionsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                            setMedicalAdvice(sorted[0]);
                        } else if (suggestionsData) {
                            setMedicalAdvice(suggestionsData);
                        }
                    }
                } catch {/* continue without advice */}

                // Fetch real appointments and enrich with doctor names
                const appointmentsResponse = await fetch(`${API_BASE_URL}/appointment/getmine`, { headers });
                if (!appointmentsResponse.ok) throw new Error('Failed to fetch appointments');
                const appointmentsData = await appointmentsResponse.json();
                const enrichedAppointments = await Promise.all(
                    appointmentsData.map(async app => {
                        let doctorName = 'Unknown Doctor';
                        try {
                            const docRes = await fetch(`${API_BASE_URL}/doctor/${app.doctorId || app.doctor_id}`, { headers });
                            if (docRes.ok) {
                                const docData = await docRes.json();
                                doctorName = docData.name;
                            }
                        } catch (e) {
                            console.error('Error fetching doctor details:', e);
                        }
                        return { ...app, doctorName };
                    })
                );
                setAppointments(enrichedAppointments);

                // Fetch real medical records
                const recordsResponse = await fetch(`${API_BASE_URL}/medical_record/patient/records`, { headers });
                if (!recordsResponse.ok) throw new Error('Failed to fetch medical records');
                const recordsData = await recordsResponse.json();
                setMedicalRecords(recordsData);

                // Extract latest health metrics from medical records
                if (Array.isArray(recordsData) && recordsData.length) {
                    const latestRecord = recordsData.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate))[0];
                    setHealthMetrics({
                        height: latestRecord.height,
                        weight: latestRecord.weight,
                        bloodPressure: latestRecord.bloodPressure,
                        heartRate: latestRecord.heartRate,
                        respiratoryRate: latestRecord.respiratoryRate,
                        temperature: latestRecord.temperature,
                        oxygenSaturation: latestRecord.oxygenSaturation
                    });
                }

                // No separate medications or healthMetrics APIs; metrics extracted above

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 12
            }
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    // Function to get the next appointment
    const getNextAppointment = () => {
        const today = new Date().toISOString().split('T')[0];
        const upcoming = appointments
            .filter(app => app.date >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return upcoming.length > 0 ? upcoming[0] : null;
    };

    // Format the date in a nice readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const nextAppointment = getNextAppointment();
    
    return (
        <motion.div 
            className="patient-dashboard"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h2>Welcome back, {patientInfo?.name?.split(' ')[0] || 'Patient'}</h2>
                    <p className="dashboard-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {medicalAdvice && (
                <motion.div className="medical-advice-card" variants={itemVariants}>
                    <div className="card-header">
                        <FiMessageSquare className="card-icon" />
                        <h3>Recent Medical Advice</h3>
                        <span className="ai-generated-label">-  AI Generated</span>
                    </div>
                    <div className="advice-content">
                        <p className="advice-text" dangerouslySetInnerHTML={{ 
                            __html: medicalAdvice.suggestionText ? 
                                medicalAdvice.suggestionText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : ''
                        }}></p>
                        
                    </div>
                </motion.div>
            )}

            {nextAppointment && (
                <motion.div className="next-appointment-card" variants={itemVariants}>
                    <div className="card-header">
                        <FiCalendar className="card-icon" />
                        <h3>Your Next Appointment</h3>
                    </div>
                    <div className="appointment-details">
                        <div className="appointment-date-time">
                            <div className="date">
                                {new Date(nextAppointment.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                            <div className="time">{nextAppointment.time}</div>
                        </div>
                        <div className="appointment-info">
                            <h4>With {nextAppointment.doctorName}</h4>
                            <p className="reason">{nextAppointment.reason}</p>
                            <span className={`status-badge ${nextAppointment.status || ''}`}>
                                {capitalize(nextAppointment.status)}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="dashboard-row">
                <motion.div className="health-metrics-card" variants={itemVariants}>
                    <div className="card-header">
                        <FiAlertCircle className="card-icon" />
                        <h3>Your Health Metrics</h3>
                    </div>
                    <div className="metrics-grid">
                        <div className="metric-item">
                            <span className="metric-label">Height</span>
                            <span className="metric-value">{healthMetrics.height}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Weight</span>
                            <span className="metric-value">{healthMetrics.weight}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Blood Pressure</span>
                            <span className="metric-value">{healthMetrics.bloodPressure}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Heart Rate</span>
                            <span className="metric-value">{healthMetrics.heartRate}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Respiratory Rate</span>
                            <span className="metric-value">{healthMetrics.respiratoryRate}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Temperature</span>
                            <span className="metric-value">{healthMetrics.temperature}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Oxygen Saturation</span>
                            <span className="metric-value">{healthMetrics.oxygenSaturation}</span>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div className="medications-card" variants={itemVariants}>
                    <div className="card-header">
                        <FiCheck className="card-icon" />
                        <h3>Current Medications</h3>
                    </div>
                    {medications.length > 0 ? (
                        <div className="medications-list">
                            {medications.map((med, idx) => (
                                <div key={med.id ?? idx} className="medication-item">
                                    <div className="medication-name">{med.name} - {med.dosage}</div>
                                    <div className="medication-details">
                                        <span className="medication-frequency">{med.frequency}</span>
                                        <span className="medication-purpose">{med.purpose}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No current medications</p>
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="dashboard-row">
                <motion.div className="appointments-card" variants={itemVariants}>
                    <div className="card-header">
                        <FiCalendar className="card-icon" />
                        <h3>Upcoming Appointments</h3>
                    </div>
                    {appointments.length > 0 ? (
                        <div className="appointments-list">
                            {appointments.map((appointment, idx) => (
                                <div key={appointment.appointmentId ?? idx} className={`appointment-item ${appointment.status || ''}`}>
                                    <div className="appointment-date-badge">
                                        {new Date(appointment.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="appointment-content">
                                        <h4>{appointment.doctorName}</h4>
                                        <div className="appointment-details-row">
                                            <span className="appointment-time">{appointment.time}</span>
                                            <span className="appointment-reason">{appointment.reason}</span>
                                        </div>
                                    </div>
                                    <div className="appointment-status">
                                        <span className={`status-badge ${appointment.status || ''}`}>
                                            {capitalize(appointment.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="view-all-link">
                                <button className="view-all-button" onClick={() => console.log('View all appointments clicked')}>
                                    View all appointments
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No upcoming appointments</p>
                        </div>
                    )}
                </motion.div>
                
                <motion.div className="records-card" variants={itemVariants}>
                    <div className="card-header">
                        <FiFileText className="card-icon" />
                        <h3>Recent Medical Records</h3>
                    </div>
                    {medicalRecords.length > 0 ? (
                        <div className="records-list">
                            {medicalRecords.map((record, idx) => (
                                <div key={record.recordId ?? idx} className="record-item">
                                    <div className="record-date">
                                        {new Date(record.recordDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="record-content">
                                        <div className="record-doctor">{record.doctorName}</div>
                                        <div className="record-diagnosis">{record.diagnosis}</div>
                                        <div className="record-notes">{record.notes.substring(0, 60)}...</div>
                                    </div>
                                    <div className="record-action">
                                        <button className="view-button">View</button>
                                    </div>
                                </div>
                            ))}
                            <div className="view-all-link">
                                <button className="view-all-button" onClick={() => console.log('View all medical records clicked')}>
                                    View all medical records
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No medical records available</p>
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div className="health-tips-section" variants={itemVariants}>
                <div className="card-header">
                    <FiInfo className="card-icon" />
                    <h3>Health Tips & Reminders</h3>
                </div>
                <div className="tips-container">
                    <div className="tip-card">
                        <h4>Stay Hydrated</h4>
                        <p>Drink at least 8 glasses of water daily to maintain proper hydration.</p>
                    </div>
                    <div className="tip-card">
                        <h4>Regular Exercise</h4>
                        <p>Aim for at least 30 minutes of moderate exercise most days of the week.</p>
                    </div>
                    <div className="tip-card">
                        <h4>Medication Reminder</h4>
                        <p>Don't forget to take your allergy medication daily until May 15th.</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PatientDashboard;