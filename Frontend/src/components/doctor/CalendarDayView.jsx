import { useMemo } from 'react';
import { Clock, Stethoscope, Plus, User, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

// Helper to generate time slot strings given start time, end time, and duration minutes
function generateDailySlots(startStr = '09:00 AM', endStr = '05:00 PM', durationMin = 30) {
  const parseHour = (str) => {
    const [time, modifier] = str.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const startMin = parseHour(startStr);
  const endMin = parseHour(endStr);
  const slots = [];

  for (let current = startMin; current < endMin; current += durationMin) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    const modifier = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const formatted = `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${modifier}`;
    slots.push(formatted);
  }

  return slots;
}

function CalendarDayView({
  selectedDate,
  appointments,
  onOpenAppointment,
  onBookSlot,
  availability,
}) {
  const startStr = availability?.startTime || '09:00 AM';
  const endStr = availability?.endTime || '05:00 PM';
  const durationMin = availability?.slotDuration || 30;

  const timeSlots = useMemo(() => {
    return generateDailySlots(startStr, endStr, durationMin);
  }, [startStr, endStr, durationMin]);

  // Appointments on selected date
  const dayAppointments = appointments.filter((a) => a.date === selectedDate);

  // Blackout / Unavailable Check
  const blackout = availability?.unavailableDates?.find((u) => u.date === selectedDate);
  const dateObj = new Date(selectedDate);
  const dayOfWeekName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const isNonWorkingDay = availability?.workingDays && !availability.workingDays.includes(dayOfWeekName);
  const isUnavailable = Boolean(blackout) || isNonWorkingDay;

  return (
    <div className="day-view-timeline">
      {/* Blackout notice */}
      {blackout && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={18} color="var(--danger)" />
          <div style={{ fontSize: 13, color: '#991b1b' }}>
            <strong>Clinic Unavailable:</strong> {blackout.reason} on {selectedDate}.
          </div>
        </div>
      )}

      {isNonWorkingDay && !blackout && (
        <div style={{ background: '#f3f4f6', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={18} color="var(--secondary)" />
          <div style={{ fontSize: 13, color: 'var(--secondary)' }}>
            <strong>Weekly Off-Duty:</strong> {dayOfWeekName} is outside regular clinical hours.
          </div>
        </div>
      )}

      {/* Slots List */}
      {timeSlots.map((slotTime) => {
        // Find appointment starting at or around this slot time
        const apt = dayAppointments.find((a) => a.time === slotTime);

        if (apt) {
          return (
            <div
              key={slotTime}
              className={`timeline-slot-row ${apt.status}`}
              onClick={() => onOpenAppointment(apt)}
              style={{ cursor: 'pointer' }}
            >
              <div className="timeline-slot-time">
                <Clock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                {slotTime}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{apt.patientName}</span>
                  <span style={{ fontSize: 12, color: 'var(--secondary)' }}>
                    ({apt.patientAge}y &bull; {apt.patientGender})
                  </span>
                  <Badge
                    status={apt.status}
                    label={apt.status.toUpperCase()}
                  />
                  <span style={{ fontSize: 12, color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Stethoscope size={13} /> {apt.room || 'Room 3B'}
                  </span>
                </div>

                <div style={{ fontSize: 12.5, color: 'var(--secondary)', marginTop: 4 }}>
                  <strong>Chief Complaint:</strong> {apt.symptoms || 'General clinical visit'}
                </div>
              </div>

              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAppointment(apt);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        }

        // Available slot
        return (
          <div
            key={slotTime}
            className="timeline-slot-row available"
            style={{ opacity: isUnavailable ? 0.6 : 1 }}
          >
            <div className="timeline-slot-time">
              <Clock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
              {slotTime}
            </div>

            <div style={{ flex: 1, fontSize: 13, color: 'var(--secondary)' }}>
              {isUnavailable ? 'Clinic closed for this slot' : 'Open for in-person consultation'}
            </div>

            {!isUnavailable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookSlot(selectedDate, slotTime)}
                style={{ color: 'var(--primary)', borderColor: 'var(--border)' }}
              >
                <Plus size={13} style={{ marginRight: 4 }} />
                Book Slot
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CalendarDayView;

