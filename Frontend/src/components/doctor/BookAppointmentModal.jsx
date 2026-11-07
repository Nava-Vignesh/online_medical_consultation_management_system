import { useState } from 'react';
import { X, Calendar, Clock, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import { patients } from '../../data/dummyData';

const COMMON_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

function BookAppointmentModal({
  isOpen,
  onClose,
  initialDate,
  initialTime,
  appointmentsList,
  onBook,
  doctor,
}) {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [date, setDate] = useState(initialDate || '2026-11-07');
  const [time, setTime] = useState(initialTime || '10:00 AM');
  const [type, setType] = useState('In-Person Consultation');
  const [room, setRoom] = useState('Consultation Room 3B');
  const [symptoms, setSymptoms] = useState('');
  const [conflictError, setConflictError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setConflictError(null);

    // Overlap prevention logic
    const existingConflict = appointmentsList.find(
      (a) => a.date === date && a.time === time && a.status !== 'cancelled'
    );

    if (existingConflict) {
      setConflictError(
        `Time slot conflict: Dr. ${doctor?.name || 'Priya Nair'} already has a ${existingConflict.status} appointment with ${existingConflict.patientName} at ${time} on ${date}. Please select an available non-overlapping time slot.`
      );
      return;
    }

    const patientObj = patients.find((p) => p.id === patientId) || patients[0];
    const newApt = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      patientId: patientObj.id,
      patientName: patientObj.name,
      patientAge: patientObj.age,
      patientGender: patientObj.gender,
      doctorName: doctor?.name || 'Dr. Priya Nair',
      doctorId: doctor?.id || 'D001',
      date,
      time,
      type,
      symptoms: symptoms || 'General in-person outpatient review',
      vitals: { bp: '120/80 mmHg', pulse: '74 bpm', temp: '98.6 °F', weight: '70 kg' },
      status: 'confirmed',
      room,
    };

    onBook(newApt);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Stethoscope size={18} color="var(--primary)" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Book In-Person Appointment</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--secondary)' }}>Schedule an outpatient clinical consultation</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            {/* Conflict Error Notice */}
            {conflictError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12.5, color: '#991b1b', lineHeight: 1.4 }}>
                  {conflictError}
                </div>
              </div>
            )}

            {/* Patient Select */}
            <div className="input-wrapper">
              <label className="input-label">Select Patient *</label>
              <select
                className="input-field"
                required
                value={patientId}
                onChange={(e) => {
                  setPatientId(e.target.value);
                  setConflictError(null);
                }}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender}, {p.age}y &bull; Blood: {p.bloodGroup})
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-wrapper">
                <label className="input-label">Consultation Date *</label>
                <input
                  type="date"
                  className="input-field"
                  required
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setConflictError(null);
                  }}
                />
              </div>

              <div className="input-wrapper">
                <label className="input-label">Time Slot *</label>
                <select
                  className="input-field"
                  required
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setConflictError(null);
                  }}
                >
                  {COMMON_SLOTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type & Room */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-wrapper">
                <label className="input-label">Consultation Type</label>
                <select
                  className="input-field"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="In-Person Consultation">In-Person Consultation</option>
                  <option value="In-Clinic Checkup">In-Clinic Checkup</option>
                  <option value="Follow-up Consultation">Follow-up Consultation</option>
                  <option value="Routine Review">Routine Review</option>
                </select>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Consultation Room</label>
                <input
                  type="text"
                  className="input-field"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
            </div>

            {/* Symptoms / Chief Complaint */}
            <div className="input-wrapper">
              <label className="input-label">Chief Complaint &amp; Clinical Notes</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Patient symptoms, reason for visit..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <CheckCircle size={14} style={{ marginRight: 6 }} />
              Confirm Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookAppointmentModal;

