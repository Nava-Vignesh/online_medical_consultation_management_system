import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Phone, Mail, FileText, Stethoscope,
  Calendar, AlertCircle, ChevronRight, X, HeartPulse, UserPlus
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { patients as initialPatients, consultationRecords } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorPatients() {
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = useMemo(() => {
    return patientList.filter((p) => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.bloodGroup.toLowerCase().includes(q) ||
          (p.chronicConditions && p.chronicConditions.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [patientList, filterStatus, searchQuery]);

  return (
    <div>
      <PageHeader
        title="My Patients Directory"
        subtitle="Manage assigned patients, review clinical histories, and monitor ongoing treatments."
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate('/doctor/appointments')}
          >
            <Calendar size={15} style={{ marginRight: 6 }} />
            View Schedule
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="input-field has-icon"
              placeholder="Search patients by name, blood group, conditions, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({patientList.length})
          </button>
          <button
            className={`btn btn-sm ${filterStatus === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('active')}
          >
            Active ({patientList.filter((p) => p.status === 'active').length})
          </button>
          <button
            className={`btn btn-sm ${filterStatus === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('inactive')}
          >
            Inactive ({patientList.filter((p) => p.status === 'inactive').length})
          </button>
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Patient Caseload</div>
            <div className="card-subtitle">Showing {filteredPatients.length} registered patients</div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Contact</th>
                <th>Blood Group</th>
                <th>Chronic Conditions</th>
                <th>Allergies</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px' }}>
                    <div style={{ color: 'var(--secondary)' }}>No patients match your search criteria.</div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{patient.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
                        {patient.gender}, {patient.age} yrs &bull; ID: {patient.id}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{patient.phone}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>{patient.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-success" style={{ fontWeight: 600 }}>
                        {patient.bloodGroup}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5 }}>
                      {patient.chronicConditions || <span style={{ color: 'var(--secondary)' }}>None</span>}
                    </td>
                    <td>
                      {patient.allergies && patient.allergies !== 'None' && patient.allergies !== 'None reported' ? (
                        <span style={{ color: 'var(--danger)', fontSize: 12, fontWeight: 500 }}>
                          {patient.allergies}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--secondary)', fontSize: 12 }}>None</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12.5 }}>{patient.lastVisit}</td>
                    <td>
                      <Badge
                        status={patient.status}
                        label={patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          Medical Profile
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/doctor/consultations?patientId=${patient.id}`)}
                        >
                          Consult
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile & Medical History Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                  Patient Clinical Profile &mdash; {selectedPatient.name}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  Patient ID: {selectedPatient.id} &bull; Registered General Medicine Patient
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedPatient(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Vitals & Summary Badges */}
              <div className="patient-badge-row">
                <span className="badge badge-secondary">Age: {selectedPatient.age} years</span>
                <span className="badge badge-secondary">Gender: {selectedPatient.gender}</span>
                <span className="badge badge-success">Blood Group: {selectedPatient.bloodGroup}</span>
                <span className="badge badge-warning">Total Consultations: {selectedPatient.totalVisits || 3}</span>
                <span className="badge badge-active">Status: {selectedPatient.status.toUpperCase()}</span>
              </div>

              {/* Contact Information */}
              <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={14} color="var(--secondary)" /> {selectedPatient.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={14} color="var(--secondary)" /> {selectedPatient.email}
                  </div>
                </div>
              </div>

              {/* Allergies Alert */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedPatient.allergies && selectedPatient.allergies !== 'None' ? '#fdf2f2' : 'var(--bg)',
                  border: `1px solid ${selectedPatient.allergies && selectedPatient.allergies !== 'None' ? '#fca5a5' : 'var(--border)'}`,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 2 }}>
                  DRUG & ENVIRONMENTAL ALLERGIES
                </div>
                <div style={{ fontSize: 13.5, color: '#991b1b', fontWeight: 500 }}>
                  {selectedPatient.allergies || 'No known allergies reported.'}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', marginBottom: 4 }}>
                  CHRONIC HEALTH CONDITIONS
                </div>
                <div style={{ fontSize: 13.5, background: 'var(--bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                  {selectedPatient.chronicConditions || 'None reported.'}
                </div>
              </div>

              {/* Past Consultation Records for this patient */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', marginBottom: 8 }}>
                  PAST CONSULTATION SUMMARY
                </div>
                {consultationRecords
                  .filter((r) => r.patientId === selectedPatient.id || r.patientName === selectedPatient.name)
                  .map((rec) => (
                    <div
                      key={rec.id}
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px',
                        marginBottom: '8px',
                        background: '#fafbfa',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600 }}>
                        <span>Diagnosis: {rec.diagnosis}</span>
                        <span style={{ color: 'var(--secondary)' }}>{rec.date}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--secondary)', marginTop: '4px' }}>
                        {rec.clinicalNotes}
                      </div>
                    </div>
                  ))}
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

export default DoctorPatients;
