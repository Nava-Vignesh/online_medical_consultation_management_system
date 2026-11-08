import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, FileText, MessageSquare, Clock, Video,
  Plus, Stethoscope, ArrowRight, Phone, AlertCircle, CheckCircle, ChevronRight
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { appointments, dummyPatient, dummyPrescriptions, patientLabReports } from '../../data/dummyData';
import '../../styles/patient.css';

function PatientDashboard() {
  const navigate = useNavigate();

  // Appointments specifically for this patient
  const myAppointments = appointments.filter(
    (a) => a.patientName === dummyPatient.name || a.patientId === dummyPatient.id
  );

  const upcomingAppointment = myAppointments.find(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  ) || myAppointments[0];

  const activePrescription = dummyPrescriptions.find(
    (rx) => rx.patientId === dummyPatient.id || rx.patientName === dummyPatient.name
  );

  return (
    <div>
      <PageHeader
        title={`Welcome, ${dummyPatient.name}`}
        subtitle={`Health portal & consultation hub · Patient ID: ${dummyPatient.id}`}
        actions={
          <Button variant="primary" onClick={() => navigate('/patient/appointments')}>
            <Plus size={15} style={{ marginRight: 6 }} />
            Book New Consultation
          </Button>
        }
      />

      {/* Urgent / Upcoming Consultation Alert Banner */}
      {upcomingAppointment && (
        <div className="patient-consultation-banner">
          <div className="banner-left">
            <div className="banner-icon-circle">
              <Video size={24} color="#ffffff" />
            </div>
            <div>
              <div className="banner-badge">
                Upcoming {upcomingAppointment.type} &bull; {upcomingAppointment.date} at {upcomingAppointment.time}
              </div>
              <div className="banner-title">
                Consultation with {upcomingAppointment.doctorName}
              </div>
              <div className="banner-subtitle">
                Chief Complaint: {upcomingAppointment.symptoms}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {upcomingAppointment.type.includes('Video') && upcomingAppointment.status === 'confirmed' ? (
              <button
                className="btn btn-secondary"
                style={{ background: '#ffffff', color: 'var(--primary)', borderColor: '#ffffff', fontWeight: 600 }}
                onClick={() => navigate(`/patient/consultations?aptId=${upcomingAppointment.id}`)}
              >
                <Video size={15} style={{ marginRight: 6 }} />
                Join Video Call Now
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                style={{ background: '#ffffff', color: 'var(--primary)', borderColor: '#ffffff' }}
                onClick={() => navigate('/patient/appointments')}
              >
                Manage Booking
              </button>
            )}
            <button
              className="btn btn-ghost"
              style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', border: '1px solid' }}
              onClick={() => navigate('/patient/appointments')}
            >
              All Appointments
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Upcoming Visits"
          value={myAppointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length.toString()}
          meta="Next: Today, 10:00 AM"
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="Active Prescriptions"
          value={activePrescription ? activePrescription.medicines.length.toString() : '2'}
          meta="Valid e-prescriptions"
          icon={<FileText size={18} />}
        />
        <StatCard
          label="Past Consultations"
          value={myAppointments.filter((a) => a.status === 'completed').length.toString()}
          meta="Recorded medical visits"
          icon={<MessageSquare size={18} />}
        />
        <StatCard
          label="Lab Reports Available"
          value={patientLabReports.length.toString()}
          meta="Latest: CBC (Normal)"
          icon={<Clock size={18} />}
        />
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Appointments & Prescriptions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Appointments Table Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Consultation Schedule</div>
                <div className="card-subtitle">Your upcoming and past medical appointments</div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/patient/appointments')}>
                View All
              </Button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{apt.doctorName}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
                          {apt.doctorSpecialty || 'General Physician'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{apt.date}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>{apt.time}</div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          {apt.type.includes('Video') ? <Video size={13} color="var(--primary)" /> : <Stethoscope size={13} />}
                          {apt.type}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, maxWidth: 160 }} className="truncate">
                        {apt.symptoms}
                      </td>
                      <td>
                        <Badge
                          status={apt.status}
                          label={apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        />
                      </td>
                      <td>
                        {apt.status === 'confirmed' && apt.type.includes('Video') ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/patient/consultations?aptId=${apt.id}`)}
                          >
                            Join Call
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/patient/appointments')}
                          >
                            Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Medication Summary Card */}
          {activePrescription && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Active Medications & E-Prescription</div>
                  <div className="card-subtitle">Prescribed by {activePrescription.doctorName} &bull; {activePrescription.date}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/patient/records')}>
                  View Full Rx
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {activePrescription.medicines.map((med, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                      background: '#fafbfa',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--primary)' }}>{med.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: 2 }}>{med.dosage} &bull; {med.frequency}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--secondary)', marginTop: 4 }}>
                      Duration: {med.duration} ({med.notes || med.instruction})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Health Profile & Emergency Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">My Health Summary</div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/patient/profile')}>
                Edit <ChevronRight size={14} />
              </Button>
            </div>

            <div>
              <div className="info-row">
                <span className="info-row-label">Full Name</span>
                <span className="info-row-value">{dummyPatient.name}</span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Age / Gender</span>
                <span className="info-row-value">{dummyPatient.age} years / {dummyPatient.gender}</span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Blood Group</span>
                <span className="info-row-value">
                  <span className="badge badge-success">{dummyPatient.bloodGroup}</span>
                </span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Known Allergies</span>
                <span className="info-row-value" style={{ color: 'var(--danger)', fontWeight: 600 }}>
                  {dummyPatient.allergies}
                </span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Chronic Conditions</span>
                <span className="info-row-value">{dummyPatient.chronicConditions}</span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Emergency Contact</span>
                <span className="info-row-value">{dummyPatient.emergencyContact}</span>
              </div>
            </div>

            <div className="divider" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Button variant="secondary" size="sm" onClick={() => navigate('/patient/records')}>
                Medical Records
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/patient/appointments')}>
                Book Doctor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
