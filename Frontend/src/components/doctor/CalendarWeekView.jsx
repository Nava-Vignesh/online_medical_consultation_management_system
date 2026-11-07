import { useMemo } from 'react';
import { Clock, Plus, Stethoscope, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

function CalendarWeekView({
  selectedDate,
  onSelectDate,
  appointments,
  onOpenAppointment,
  onBookSlot,
  availability,
}) {
  // Compute the 7 dates of the selected week (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const sel = new Date(selectedDate);
    const dayOfWeek = sel.getDay(); // 0 is Sunday
    const startOfWeek = new Date(sel);
    startOfWeek.setDate(sel.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        dateObj: d,
        dateKey,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
        dateNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return days;
  }, [selectedDate]);

  const todayKey = '2026-11-07';

  return (
    <div className="week-view-container">
      {weekDays.map((day) => {
        const dayAppointments = appointments.filter((a) => a.date === day.dateKey);
        const isSelected = selectedDate === day.dateKey;
        const isToday = day.dateKey === todayKey;

        const blackout = availability?.unavailableDates?.find((u) => u.date === day.dateKey);
        const isNonWorkingDay = availability?.workingDays && !availability.workingDays.includes(day.fullDayName);
        const isUnavailable = Boolean(blackout) || isNonWorkingDay;

        return (
          <div
            key={day.dateKey}
            className="week-day-column"
            style={{
              borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
              background: isSelected ? '#fbfdfc' : 'var(--white)',
            }}
            onClick={() => onSelectDate(day.dateKey)}
          >
            {/* Column Header */}
            <div className={`week-day-header${isToday ? ' today' : ''}`}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isToday ? 'var(--primary)' : 'var(--secondary)', textTransform: 'uppercase' }}>
                {day.dayName}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                {day.dateNum} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--secondary)' }}>{day.monthName}</span>
              </div>
              {blackout ? (
                <div style={{ fontSize: 10, color: 'var(--danger)', fontWeight: 600, marginTop: 2 }}>
                  Unavailable
                </div>
              ) : isNonWorkingDay ? (
                <div style={{ fontSize: 10, color: 'var(--secondary)', marginTop: 2 }}>
                  Off-Duty
                </div>
              ) : (
                <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>
                  {dayAppointments.length} Booked
                </div>
              )}
            </div>

            {/* Column Appointments Content */}
            <div className="week-day-content">
              {isUnavailable && dayAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--secondary)', fontSize: 11 }}>
                  {blackout ? blackout.reason : 'Non-working clinic day'}
                </div>
              ) : dayAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--secondary)', fontSize: 11.5 }}>
                  No appointments
                </div>
              ) : (
                dayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`calendar-appt-pill ${apt.status}`}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      whiteSpace: 'normal',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDate(day.dateKey);
                      onOpenAppointment(apt);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={11} /> {apt.time}
                      </span>
                      <span style={{ fontSize: 9.5, textTransform: 'uppercase' }}>
                        {apt.status}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 12.5, marginTop: 4, color: 'var(--text)' }}>
                      {apt.patientName}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--secondary)', marginTop: 2 }}>
                      {apt.room || 'Room 3B'}
                    </div>
                  </div>
                ))
              )}

              {/* Quick Book Slot Button */}
              {!isUnavailable && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{
                    marginTop: 'auto',
                    fontSize: 11,
                    color: 'var(--primary)',
                    padding: '6px',
                    border: '1px dashed var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDate(day.dateKey);
                    onBookSlot(day.dateKey);
                  }}
                >
                  <Plus size={12} style={{ marginRight: 3 }} /> Add Slot
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CalendarWeekView;

