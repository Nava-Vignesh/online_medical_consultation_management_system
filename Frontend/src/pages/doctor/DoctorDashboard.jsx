import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, CheckCircle, Clock, Video,
  ArrowRight, Phone, Mail, Stethoscope, ChevronRight, X
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { appointments, patients, dummyDoctor } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctorStatus, setDoctorStatus] = useState(dummyDoctor.status || 'available');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Today's appointments (defaulting to 2026-11-07 from dummy data)
  const todayAppointments = appointments.filter(
    (apt) => apt.date === '2026-11-07' && apt.status !== 'cancelled'
  );

  const nextAppointment = todayAppointments.find(
    (apt) => apt.status === 'confirmed'
  ) || todayAppointments[0];

  const statusColors = {
    available: 'status-dot-available',
    busy: 'status-dot-busy',
    'off-duty': 'status-dot-off-duty',
  };

  return (
    <div>
      <PageHeader
        title={`Good morning, ${dummyDoctor.name}`}
        subtitle={`${dummyDoctor.specialization} · ${dummyDoctor.department} · License #${dummyDoctor.regNumber}`}
        actions={
          <div className="doctor-status-bar">
            <span className={`status-indicator-dot ${statusColors[doctorStatus] || 'status-dot-available'}`} />
            <select
              className="status-select"
              value={doctorStatus}
              onChange={(e) => setDoctorStatus(e.target.value)}
              aria-label="Doctor Availability Status"
            >
              <option value="available">Available for Consultations</option>
              <option value="busy">Busy / In Consultation</option>
              <option value="off-duty">Off-Duty / Away</option>
            </select>
          </div>
        }
      />

      {/* Urgent / Next Consultation Banner */}
      {nextAppointment && (
        <div
          style={{
            background: 'linear-gradient(135deg, #245C4A 0%, #1a4337 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            padding: '18px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Video size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.8px', opacity: 0.85 }}>
                Next Online Consultation &bull; {nextAppointment.time} Today
              </div>
              <div style={{ fontSize: '17px', fontWeight: '700', marginTop: '2px' }}>
                {nextAppointment.patientName} ({nextAppointment.patientAge}y, {nextAppointment.patientGender})
              </div>
              <div style={{ fontSize: '12.5px', opacity: 0.9, marginTop: '2px' }}>
                Chief Complaint: {nextAppointment.symptoms}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              style={{ background: '#fff', color: 'var(--primary)', borderColor: '#fff' }}
              onClick={() => navigate(`/doctor/consultations?aptId=${nextAppointment.id}`)}
            >
              <Video size={15} style={{ marginRight: 6 }} />
              Enter Consultation Room
            </button>
            <button
              className="btn btn-ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', border: '1px solid' }}
              onClick={() => navigate('/doctor/appointments')}
            >
              All Appointments
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Today's Appointments"
          value={todayAppointments.length.toString()}
          meta="2 video calls · 2 in-clinic"
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="Total Patients"
          value={dummyDoctor.patients || patients.length}
          meta="Assigned caseload"
          icon={<Users size={18} />}
        />
        <StatCard
          label="Completed Consultations"
          value="31"
          meta="+18% from last week"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Pending Test Reviews"
          value="4"
          meta="Blood & Radiology reports"
          icon={<Clock size={18} />}
        />
      </div>

      <div className="dashboard-grid">
        {/* Today's Schedule Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Consultation Schedule</div>
              <div className="card-subtitle">Scheduled appointments for 7 November 2026</div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('/doctor/appointments')}>
              View All Appointments
            </Button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.patientName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
                        {apt.patientAge}y · {apt.patientGender}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{apt.time}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                        {apt.type.includes('Video') ? <Video size={13} color="var(--primary)" /> : <Stethoscope size={13} />}
                        {apt.type}
                      </span>
                    </td>
                    <td style={{ maxWidth: '180px', fontSize: 12.5 }} className="truncate">
                      {apt.symptoms}
                    </td>
                    <td>
                      <Badge
                        status={apt.status}
                        label={apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      />
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant={apt.type.includes('Video') && apt.status === 'confirmed' ? 'primary' : 'secondary'}
                        onClick={() => navigate(`/doctor/consultations?aptId=${apt.id}`)}
                      >
                        {apt.type.includes('Video') ? 'Consult' : 'View'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Assigned Patients</div>
              <div className="card-subtitle">Recent patient records</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/patients')}>
              View All <ArrowRight size={13} style={{ marginLeft: 4 }} />
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {patients.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="info-row"
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '10px 0',
                }}
                onClick={() => setSelectedPatient(p)}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>
                    {p.gender}, Age {p.age} &bull; Blood: <strong>{p.bloodGroup}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Badge status={p.status} label={p.status.charAt(0).toUpperCase() + p.status.slice(1)} />
                  <ChevronRight size={15} color="var(--secondary)" />
                </div>
              </div>
            ))}
          </div>

          <div className="divider" />

          {/* Quick Shortcuts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => navigate('/doctor/records')}>
              Write Prescription
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/doctor/profile')}>
              Manage Slots
            </Button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Patient Profile: {selectedPatient.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>ID: {selectedPatient.id}</p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedPatient(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="patient-badge-row">
                <span className="badge badge-secondary">Age: {selectedPatient.age}</span>
                <span className="badge badge-secondary">Gender: {selectedPatient.gender}</span>
                <span className="badge badge-success">Blood Group: {selectedPatient.bloodGroup}</span>
                <span className="badge badge-warning">Visits: {selectedPatient.totalVisits || 1}</span>
              </div>

              <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 6 }}>
                  <Phone size={14} color="var(--secondary)" /> {selectedPatient.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <Mail size={14} color="var(--secondary)" /> {selectedPatient.email}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--secondary)', marginBottom: 4 }}>
                  KNOWN ALLERGIES
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--danger)', fontWeight: 500 }}>
                  {selectedPatient.allergies || 'No known drug allergies reported'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--secondary)', marginBottom: 4 }}>
                  CHRONIC CONDITIONS
                </div>
                <div style={{ fontSize: 13.5 }}>
                  {selectedPatient.chronicConditions || 'None reported'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--secondary)', marginBottom: 4 }}>
                  LAST CLINICAL VISIT
                </div>
                <div style={{ fontSize: 13.5 }}>{selectedPatient.lastVisit}</div>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setSelectedPatient(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedPatient(null);
                  navigate('/doctor/consultations');
                }}
              >
                Start Consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
