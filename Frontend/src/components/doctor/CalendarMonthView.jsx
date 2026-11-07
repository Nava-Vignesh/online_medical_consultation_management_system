import { useMemo } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarMonthView({
  currentDate,
  selectedDate,
  onSelectDate,
  appointments,
  onOpenAppointment,
  availability,
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calculate calendar days matrix
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const cells = [];

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDate - i;
      const d = new Date(year, month - 1, day);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        day,
        dateKey,
        dateObj: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= lastDateOfMonth; day++) {
      const d = new Date(year, month, day);
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        day,
        dateKey,
        dateObj: d,
        isCurrentMonth: true,
      });
    }

    // Next month padding to complete 35 or 42 cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      cells.push({
        day: i,
        dateKey,
        dateObj: d,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [year, month]);

  const todayKey = '2026-11-07'; // local system anchor date

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="calendar-month-table">
        <thead>
          <tr>
            {WEEKDAYS.map((wd) => (
              <th key={wd}>{wd}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(calendarCells.length / 7) }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {calendarCells.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell) => {
                const dayAppointments = appointments.filter((a) => a.date === cell.dateKey);
                const isSelected = selectedDate === cell.dateKey;
                const isToday = cell.dateKey === todayKey;

                // Check unavailable / blackout
                const blackout = availability?.unavailableDates?.find((u) => u.date === cell.dateKey);
                const dayName = cell.dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                const isNonWorkingDay = availability?.workingDays && !availability.workingDays.includes(dayName);
                const isUnavailable = Boolean(blackout) || isNonWorkingDay;

                return (
                  <td
                    key={cell.dateKey}
                    className={`calendar-month-cell${cell.isCurrentMonth ? '' : ' other-month'}${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}${isUnavailable ? ' unavailable-day' : ''}`}
                    onClick={() => onSelectDate(cell.dateKey)}
                  >
                    <div className="day-header-row">
                      <span className="day-number-badge">{cell.day}</span>
                      {blackout ? (
                        <span className="day-unavailable-tag" title={blackout.reason}>Leave</span>
                      ) : isNonWorkingDay ? (
                        <span className="day-unavailable-tag" style={{ color: 'var(--secondary)', background: '#f3f4f6' }}>Off</span>
                      ) : dayAppointments.length > 0 ? (
                        <span style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700 }}>
                          {dayAppointments.length} apt
                        </span>
                      ) : null}
                    </div>

                    {/* Appointment Badges */}
                    <div className="calendar-appt-list">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <span
                          key={apt.id}
                          className={`calendar-appt-pill ${apt.status}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDate(cell.dateKey);
                            onOpenAppointment(apt);
                          }}
                          title={`${apt.time} - ${apt.patientName} (${apt.status})`}
                        >
                          <strong>{apt.time.split(' ')[0]}</strong> {apt.patientName.split(' ')[0]}
                        </span>
                      ))}

                      {dayAppointments.length > 3 && (
                        <span className="calendar-more-count">
                          +{dayAppointments.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CalendarMonthView;

