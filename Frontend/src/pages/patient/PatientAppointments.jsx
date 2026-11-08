import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Video, Stethoscope, Search, Plus,
  CheckCircle, X, AlertCircle, Phone, Star, Shield
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { appointments as initialAppointments, doctors, dummyPatient } from '../../data/dummyData';
import '../../styles/patient.css';

function PatientAppointments() {
  const navigate = useNavigate();
  const [appointmentsList, setAppointmentsList] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedAptDetails, setSelectedAptDetails] = useState(null);
  const [rescheduleApt, setRescheduleApt] = useState(null);

  // New Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'D001');
  const [consultationMode, setConsultationMode] = useState('Video Consultation');
  const [bookingDate, setBookingDate] = useState('2026-11-09');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [symptomsInput, setSymptomsInput] = useState('');

  // Reschedule Form State
  const [newRescheduleDate, setNewRescheduleDate] = useState('2026-11-10');
  const [newRescheduleSlot, setNewRescheduleSlot] = useState('11:30 AM');

  // Filter only for this patient
  const patientApts = useMemo(() => {
    return appointmentsList.filter(
      (a) => a.patientName === dummyPatient.name || a.patientId === dummyPatient.id
    );
  }, [appointmentsList]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: patientApts.length,
      upcoming: patientApts.filter((a) => a.status === 'confirmed' || a.status === 'pending').length,
      confirmed: patientApts.filter((a) => a.status === 'confirmed').length,
      pending: patientApts.filter((a) => a.status === 'pending').length,
      completed: patientApts.filter((a) => a.status === 'completed').length,
      cancelled: patientApts.filter((a) => a.status === 'cancelled').length,
    };
  }, [patientApts]);

  // Filtered list
  const filteredAppointments = useMemo(() => {
    return patientApts.filter((apt) => {
      if (activeTab === 'upcoming' && apt.status !== 'confirmed' && apt.status !== 'pending') return false;
      if (activeTab === 'confirmed' && apt.status !== 'confirmed') return false;
      if (activeTab === 'pending' && apt.status !== 'pending') return false;
      if (activeTab === 'completed' && apt.status !== 'completed') return false;
      if (activeTab === 'cancelled' && apt.status !== 'cancelled') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          apt.doctorName.toLowerCase().includes(q) ||
          apt.symptoms.toLowerCase().includes(q) ||
          apt.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [patientApts, activeTab, searchQuery]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
    const newApt = {
      id: `APT-00${Math.floor(10 + Math.random() * 90)}`,
      patientId: dummyPatient.id,
      patientName: dummyPatient.name,
      patientAge: dummyPatient.age,
      patientGender: dummyPatient.gender,
      doctorName: doc.name,
      doctorId: doc.id,
      doctorSpecialty: doc.specialization,
      date: bookingDate,
      time: selectedSlot,
      type: consultationMode,
      symptoms: symptomsInput || 'Routine Consultation & Health Review',
      vitals: { bp: '120/80 mmHg', pulse: '74 bpm', temp: '98.6 °F', weight: '72 kg' },
      status: 'confirmed',
      meetLink: `https://meet.hospital.com/room-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setAppointmentsList((prev) => [newApt, ...prev]);
    setIsBookModalOpen(false);
    setSymptomsInput('');
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleApt) return;

    setAppointmentsList((prev) =>
      prev.map((a) =>
        a.id === rescheduleApt.id
          ? { ...a, date: newRescheduleDate, time: newRescheduleSlot, status: 'confirmed' }
          : a
      )
    );
    setRescheduleApt(null);
  };

  const handleCancelApt = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointmentsList((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="My Consultations & Appointments"
        subtitle="Manage upcoming consultations, review past visit history, or book a doctor online."
        actions={
          <Button variant="primary" onClick={() => setIsBookModalOpen(true)}>
            <Plus size={15} style={{ marginRight: 6 }} />
            Book New Appointment
          </Button>
        }
      />

      {/* Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab${activeTab === 'all' ? ' active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({counts.all})
        </button>
        <button
          className={`filter-tab${activeTab === 'upcoming' ? ' active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({counts.upcoming})
        </button>
        <button
          className={`filter-tab${activeTab === 'confirmed' ? ' active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed ({counts.confirmed})
        </button>
        <button
          className={`filter-tab${activeTab === 'pending' ? ' active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({counts.pending})
        </button>
        <button
          className={`filter-tab${activeTab === 'completed' ? ' active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({counts.completed})
        </button>
        <button
          className={`filter-tab${activeTab === 'cancelled' ? ' active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({counts.cancelled})
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="input-field has-icon"
              placeholder="Search by doctor name, symptoms, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="card empty-state">
          <Calendar size={40} />
          <div className="empty-state-title">No appointments found</div>
          <div className="empty-state-desc">You do not have any appointments matching this filter.</div>
          <Button variant="primary" size="sm" onClick={() => setIsBookModalOpen(true)}>
            Book an Appointment Now
          </Button>
        </div>
      ) : (
        <div className="appointments-grid">
          {filteredAppointments.map((apt) => (
            <div key={apt.id} className="appointment-card">
              <div className="appointment-card-header">
                <div>
                  <div className="patient-info-title">{apt.doctorName}</div>
                  <div className="patient-info-meta">
                    {apt.doctorSpecialty || 'Specialist'} &bull; ID: {apt.id}
                  </div>
                </div>
                <Badge
                  status={apt.status}
                  label={apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                />
              </div>

              <div className="appointment-meta-row">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={13} /> {apt.date}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={13} /> {apt.time}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {apt.type.includes('Video') ? <Video size={13} color="var(--primary)" /> : <Stethoscope size={13} />}
                  {apt.type}
                </span>
              </div>

              <div className="appointment-symptoms">
                <strong>Reported Symptoms:</strong> {apt.symptoms}
              </div>

              {/* Action Buttons */}
              <div className="card-actions-row">
                {apt.status === 'confirmed' && apt.type.includes('Video') ? (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/patient/consultations?aptId=${apt.id}`)}
                    >
                      <Video size={14} style={{ marginRight: 4 }} />
                      Join Video Call
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setRescheduleApt(apt)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => handleCancelApt(apt.id)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : apt.status === 'pending' ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedAptDetails(apt)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => handleCancelApt(apt.id)}
                    >
                      Cancel Request
                    </Button>
                  </>
                ) : apt.status === 'completed' ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/patient/records')}
                    >
                      View Prescription
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAptDetails(apt)}
                    >
                      Visit Summary
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAptDetails(apt)}
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── BOOK APPOINTMENT MODAL ── */}
      {isBookModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBookModalOpen(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleBookingSubmit}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Book Online Consultation</h3>
                  <p style={{ fontSize: 12, color: 'var(--secondary)' }}>Choose a doctor, mode, and time slot</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsBookModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {/* 1. Select Doctor */}
                <div>
                  <label className="input-label">Select Specialist Doctor *</label>
                  <div className="doctor-selection-grid">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className={`doctor-select-card${selectedDoctorId === doc.id ? ' selected' : ''}`}
                        onClick={() => setSelectedDoctorId(doc.id)}
                      >
                        <div className="doctor-select-avatar">
                          {doc.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{doc.name}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>
                            {doc.specialization} &bull; {doc.experience}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: 4 }}>
                            <span style={{ color: '#d97706', fontWeight: 600 }}>&#9733; {doc.rating}</span>
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{doc.fee}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Select Mode (Video vs Clinic) */}
                <div>
                  <label className="input-label">Consultation Mode *</label>
                  <div className="mode-toggle-group">
                    <div
                      className={`mode-toggle-btn${consultationMode === 'Video Consultation' ? ' selected' : ''}`}
                      onClick={() => setConsultationMode('Video Consultation')}
                    >
                      <Video size={18} color="var(--primary)" />
                      <span>Online Tele-Video Call</span>
                      <small style={{ color: 'var(--secondary)', fontSize: '11px' }}>Consult securely from home</small>
                    </div>
                    <div
                      className={`mode-toggle-btn${consultationMode === 'In-Clinic Checkup' ? ' selected' : ''}`}
                      onClick={() => setConsultationMode('In-Clinic Checkup')}
                    >
                      <Stethoscope size={18} color="var(--primary)" />
                      <span>In-Hospital Visit</span>
                      <small style={{ color: 'var(--secondary)', fontSize: '11px' }}>Meet doctor at hospital</small>
                    </div>
                  </div>
                </div>

                {/* 3. Pick Date and Slot */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="input-label">Select Consultation Date *</label>
                    <input
                      type="date"
                      className="input-field"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">Available Time Slots *</label>
                    <div className="slots-grid">
                      {['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'].map((slot) => (
                        <div
                          key={slot}
                          className={`slot-chip${selectedSlot === slot ? ' selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Symptoms / Notes */}
                <div>
                  <label className="input-label">Describe Your Symptoms or Medical Concern *</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    required
                    placeholder="e.g. Mild throat pain and fever since yesterday..."
                    value={symptomsInput}
                    onChange={(e) => setSymptomsInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setIsBookModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm & Schedule Consultation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RESCHEDULE MODAL ── */}
      {rescheduleApt && (
        <div className="modal-overlay" onClick={() => setRescheduleApt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleRescheduleSubmit}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Reschedule Consultation</h3>
                  <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                    Doctor: {rescheduleApt.doctorName} &bull; Currently {rescheduleApt.date} at {rescheduleApt.time}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setRescheduleApt(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div>
                  <label className="input-label">Select New Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    required
                    value={newRescheduleDate}
                    onChange={(e) => setNewRescheduleDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Select New Slot *</label>
                  <div className="slots-grid">
                    {['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'].map((slot) => (
                      <div
                        key={slot}
                        className={`slot-chip${newRescheduleSlot === slot ? ' selected' : ''}`}
                        onClick={() => setNewRescheduleSlot(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setRescheduleApt(null)}>
                  Keep Current
                </Button>
                <Button type="submit" variant="primary">
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── APPOINTMENT DETAILS MODAL ── */}
      {selectedAptDetails && (
        <div className="modal-overlay" onClick={() => setSelectedAptDetails(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Appointment &bull; {selectedAptDetails.id}</h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  {selectedAptDetails.date} at {selectedAptDetails.time}
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedAptDetails(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600 }}>{selectedAptDetails.doctorName}</h4>
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>
                    {selectedAptDetails.doctorSpecialty || 'General Physician'}
                  </div>
                </div>
                <Badge
                  status={selectedAptDetails.status}
                  label={selectedAptDetails.status.toUpperCase()}
                />
              </div>

              <div className="divider" style={{ margin: '8px 0' }} />

              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)' }}>CONSULTATION MODE</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{selectedAptDetails.type}</div>
              </div>

              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)' }}>REPORTED SYMPTOMS</div>
                <div style={{ fontSize: 13, background: 'var(--bg)', padding: '10px', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
                  {selectedAptDetails.symptoms}
                </div>
              </div>

              {selectedAptDetails.vitals && (
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)', marginBottom: 6 }}>
                    RECORDED VITALS
                  </div>
                  <div className="vitals-summary-chips">
                    <div className="vital-chip">
                      <span className="vital-chip-label">Blood Pressure</span>
                      <span className="vital-chip-value">{selectedAptDetails.vitals.bp}</span>
                    </div>
                    <div className="vital-chip">
                      <span className="vital-chip-label">Pulse</span>
                      <span className="vital-chip-value">{selectedAptDetails.vitals.pulse}</span>
                    </div>
                    <div className="vital-chip">
                      <span className="vital-chip-label">Body Temp</span>
                      <span className="vital-chip-value">{selectedAptDetails.vitals.temp}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setSelectedAptDetails(null)}>
                Close
              </Button>
              {selectedAptDetails.status === 'confirmed' && selectedAptDetails.type.includes('Video') && (
                <Button
                  variant="primary"
                  onClick={() => {
                    const id = selectedAptDetails.id;
                    setSelectedAptDetails(null);
                    navigate(`/patient/consultations?aptId=${id}`);
                  }}
                >
                  <Video size={14} style={{ marginRight: 6 }} />
                  Enter Video Room
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;
