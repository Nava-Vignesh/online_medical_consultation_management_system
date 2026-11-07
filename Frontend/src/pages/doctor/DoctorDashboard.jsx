import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, CheckCircle, Clock,
  ArrowRight, Phone, Mail, Stethoscope, ChevronRight, X,
  TrendingUp, Star, AlertCircle, FileText
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

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === 'pending'
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
        title={`Good evening, ${dummyDoctor.name}`}
        subtitle={`${dummyDoctor.specialization} · ${dummyDoctor.department} · Reg. #${dummyDoctor.regNumber}`}
        actions={
          <div className="doctor-status-bar">
            <span className={`status-indicator-dot ${statusColors[doctorStatus] || 'status-dot-available'}`} />
            <select
              className="status-select"
              value={doctorStatus}
              onChange={(e) => setDoctorStatus(e.target.value)}
              aria-label="Doctor Clinic Status"
            >
              <option value="available">Available in Clinic</option>
              <option value="busy">In Consultation</option>
              <option value="off-duty">Away / Off-Duty</option>
            </select>
          </div>
        }
      />

      {/* Next In-Person Appointment Banner */}
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
              <Stethoscope size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.8px', opacity: 0.85 }}>
                Next In-Person Consultation &bull; {nextAppointment.time} Today &bull; {nextAppointment.room || 'Room 3B'}
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
              <Stethoscope size={15} style={{ marginRight: 6 }} />
              Start Consultation
            </button>
            <button
              className="btn btn-ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', border: '1px solid' }}
              onClick={() => navigate('/doctor/appointments')}
            >
              View Schedule
            </button>
          </div>
        </div>
      )}

      {/* Stats row styled with custom forest green emphasis card */}
      <div className="stats-grid">
        {/* Forest-green hero stat card */}
        <div
          style={{
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{todayAppointments.length}</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
              TODAY'S APPOINTMENTS
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              All in-person clinic visits
            </div>
          </div>
        </div>

        {/* Pending Consultations */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-card-value">{pendingAppointments.length}</div>
            <span className="badge badge-warning">
              <Clock size={12} style={{ marginRight: 3 }} /> Pending
            </span>
          </div>
          <div className="stat-card-label" style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>
            Pending Consultations
          </div>
          <div className="stat-card-meta">Awaiting clinic approval</div>
        </div>

        {/* Total Consultations */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-card-value">124</div>
            <span className="badge badge-success">
              <TrendingUp size={12} style={{ marginRight: 3 }} /> Lifetime
            </span>
          </div>
          <div className="stat-card-label" style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>
            Total Consultations
          </div>
          <div className="stat-card-meta">+18% this month</div>
        </div>

        {/* Rating */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-card-value">{dummyDoctor.rating || '4.9'} <span style={{ fontSize: 14, color: 'var(--secondary)' }}>/ 5</span></div>
            <span className="badge badge-warning">
              <Star size={12} style={{ marginRight: 3, fill: '#d97706' }} /> 48 reviews
            </span>
          </div>
          <div className="stat-card-label" style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>
            Average Patient Rating
          </div>
          <div className="stat-card-meta">Excellent care index</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Today's Schedule Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's In-Person Consultation Schedule</div>
              <div className="card-subtitle">Scheduled clinic appointments for today</div>
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
                  <th>Type &amp; Room</th>
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
                        <Stethoscope size={13} color="var(--primary)" />
                        {apt.room || 'Room 3B'}
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
                        variant={apt.status === 'confirmed' ? 'primary' : 'secondary'}
                        onClick={() => navigate(`/doctor/consultations?aptId=${apt.id}`)}
                      >
                        {apt.status === 'confirmed' ? 'Consult' : 'Details'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Patients */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Assigned Patients</div>
              <div className="card-subtitle">Recent patient records &amp; history</div>
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
            <Button variant="secondary" size="sm" onClick={() => navigate('/doctor/prescriptions')}>
              <FileText size={13} style={{ marginRight: 4 }} />
              Write Rx
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/doctor/schedule')}>
              <Calendar size={13} style={{ marginRight: 4 }} />
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
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Patient Clinical Record: {selectedPatient.name}</h3>
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
                  const pId = selectedPatient.id;
                  setSelectedPatient(null);
                  navigate(`/doctor/consultations?patientId=${pId}`);
                }}
              >
                <Stethoscope size={14} style={{ marginRight: 6 }} />
                Start In-Person Consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
