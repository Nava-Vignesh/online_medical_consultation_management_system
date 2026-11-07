import { X, Calendar, Clock, Stethoscope, User, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

function AppointmentDetailModal({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
  onStartConsultation,
}) {
  if (!isOpen || !appointment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Stethoscope size={18} color="var(--primary)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>In-Person Consultation Details</h3>
            </div>
            <p style={{ fontSize: 12, color: 'var(--secondary)' }}>ID: {appointment.id}</p>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Patient Overview */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700 }}>{appointment.patientName}</h4>
              <p style={{ fontSize: 12.5, color: 'var(--secondary)' }}>
                {appointment.patientAge} years &bull; {appointment.patientGender} &bull; ID: {appointment.patientId}
              </p>
            </div>
            <Badge
              status={appointment.status}
              label={appointment.status.toUpperCase()}
            />
          </div>

          <div className="divider" style={{ margin: '4px 0' }} />

          {/* Schedule & Room */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'var(--bg)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase' }}>Date &amp; Time</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{appointment.date} at {appointment.time}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase' }}>Clinic Location</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{appointment.room || 'Consultation Room 3B'}</div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)', marginBottom: 4 }}>
              REPORTED SYMPTOMS &amp; CHIEF COMPLAINT
            </div>
            <div style={{ fontSize: 13, background: '#fdfdfd', borderLeft: '3px solid var(--primary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              {appointment.symptoms || 'General clinical review'}
            </div>
          </div>

          {/* Vitals */}
          {appointment.vitals && (
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)', marginBottom: 6 }}>
                CHECK-IN RECORDED VITALS
              </div>
              <div className="vitals-summary-chips">
                <div className="vital-chip">
                  <span className="vital-chip-label">Blood Pressure</span>
                  <span className="vital-chip-value">{appointment.vitals.bp || '120/80'}</span>
                </div>
                <div className="vital-chip">
                  <span className="vital-chip-label">Pulse</span>
                  <span className="vital-chip-value">{appointment.vitals.pulse || '76 bpm'}</span>
                </div>
                <div className="vital-chip">
                  <span className="vital-chip-label">Body Temp</span>
                  <span className="vital-chip-value">{appointment.vitals.temp || '98.6 °F'}</span>
                </div>
                {appointment.vitals.weight && (
                  <div className="vital-chip">
                    <span className="vital-chip-label">Weight</span>
                    <span className="vital-chip-value">{appointment.vitals.weight}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Status Update */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)', marginBottom: 6 }}>
              UPDATE APPOINTMENT STATUS
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['confirmed', 'pending', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm ${appointment.status === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                  onClick={() => onStatusChange && onStatusChange(appointment.id, st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {appointment.status !== 'cancelled' && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                if (onStartConsultation) onStartConsultation(appointment);
              }}
            >
              <Stethoscope size={14} style={{ marginRight: 6 }} />
              Start In-Person Consultation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailModal;

