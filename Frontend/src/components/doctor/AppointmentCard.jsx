import { Calendar, Clock, Stethoscope, CheckCircle, FileText, X } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

function AppointmentCard({
  appointment,
  onStartConsultation,
  onViewDetails,
  onReschedule,
  onStatusChange,
  onViewRecords,
}) {
  const { id, patientName, patientAge, patientGender, date, time, type, symptoms, vitals, status, room } = appointment;

  return (
    <div className="appointment-card">
      <div className="appointment-card-header">
        <div>
          <div className="patient-info-title">{patientName}</div>
          <div className="patient-info-meta">
            {patientAge} yrs &bull; {patientGender} &bull; ID: {id}
          </div>
        </div>
        <Badge status={status} label={status.charAt(0).toUpperCase() + status.slice(1)} />
      </div>

      <div className="appointment-meta-row">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Calendar size={13} /> {date}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Clock size={13} /> {time}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Stethoscope size={13} color="var(--primary)" />
          {room || type || 'In-Person Consultation'}
        </span>
      </div>

      <div className="appointment-symptoms">
        <strong>Chief Complaint:</strong> {symptoms || 'General clinical consultation'}
      </div>

      {vitals && (
        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--secondary)', flexWrap: 'wrap' }}>
          <span>BP: <strong>{vitals.bp}</strong></span>
          <span>Pulse: <strong>{vitals.pulse}</strong></span>
          <span>Temp: <strong>{vitals.temp}</strong></span>
          {vitals.weight && <span>Weight: <strong>{vitals.weight}</strong></span>}
        </div>
      )}

      <div className="card-actions-row">
        {status === 'pending' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusChange && onStatusChange(id, 'confirmed')}
            >
              <CheckCircle size={14} style={{ marginRight: 4 }} />
              Accept
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onReschedule && onReschedule(appointment)}
            >
              Reschedule
            </Button>
            <Button
              variant="ghost"
              size="sm"
              style={{ color: 'var(--danger)' }}
              onClick={() => onStatusChange && onStatusChange(id, 'cancelled')}
            >
              Decline
            </Button>
          </>
        )}

        {status === 'confirmed' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStartConsultation && onStartConsultation(appointment)}
            >
              <Stethoscope size={14} style={{ marginRight: 4 }} />
              Start Consultation
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails && onViewDetails(appointment)}
            >
              Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReschedule && onReschedule(appointment)}
            >
              Reschedule
            </Button>
          </>
        )}

        {status === 'completed' && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewRecords ? onViewRecords(appointment) : onViewDetails(appointment)}
            >
              <FileText size={14} style={{ marginRight: 4 }} />
              View Rx / Notes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails && onViewDetails(appointment)}
            >
              Details
            </Button>
          </>
        )}

        {status === 'cancelled' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails && onViewDetails(appointment)}
          >
            View Details
          </Button>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;

