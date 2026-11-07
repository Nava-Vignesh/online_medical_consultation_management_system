import { useState } from 'react';
import { X, CheckCircle, Calendar, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function ManageAvailabilityModal({
  isOpen,
  onClose,
  availability,
  onSave,
}) {
  const [workingDays, setWorkingDays] = useState(
    availability?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  );
  const [startTime, setStartTime] = useState(availability?.startTime || '09:00 AM');
  const [endTime, setEndTime] = useState(availability?.endTime || '05:00 PM');
  const [slotDuration, setSlotDuration] = useState(availability?.slotDuration || 30);
  const [unavailableDates, setUnavailableDates] = useState(
    availability?.unavailableDates || [
      { date: '2026-11-15', reason: 'Sunday Clinic Maintenance' },
      { date: '2026-11-22', reason: 'Annual Medical Conference' },
      { date: '2026-11-29', reason: 'Public Holiday' },
    ]
  );

  // New unavailable date input
  const [newUnavailDate, setNewUnavailDate] = useState('');
  const [newUnavailReason, setNewUnavailReason] = useState('');

  if (!isOpen) return null;

  const toggleDay = (day) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddUnavailableDate = (e) => {
    e.preventDefault();
    if (!newUnavailDate) return;
    if (unavailableDates.some((d) => d.date === newUnavailDate)) {
      alert('This date is already marked as unavailable.');
      return;
    }
    setUnavailableDates([
      ...unavailableDates,
      { date: newUnavailDate, reason: newUnavailReason || 'Doctor on leave' },
    ]);
    setNewUnavailDate('');
    setNewUnavailReason('');
  };

  const handleRemoveUnavailableDate = (dateToRemove) => {
    setUnavailableDates((prev) => prev.filter((d) => d.date !== dateToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      workingDays,
      startTime,
      endTime,
      slotDuration: Number(slotDuration),
      unavailableDates,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} color="var(--primary)" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Manage Clinic Availability &amp; Hours</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                Configure in-person consultation days, hours, slot duration and blackout dates
              </p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            {/* Working Days */}
            <div>
              <label className="input-label">Select Weekly Working Days *</label>
              <div className="schedule-days-grid" style={{ marginTop: 6 }}>
                {ALL_DAYS.map((day) => {
                  const isChecked = workingDays.includes(day);
                  return (
                    <div
                      key={day}
                      className={`schedule-day-box${isChecked ? ' selected' : ''}`}
                      onClick={() => toggleDay(day)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: 12.5 }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="divider" style={{ margin: '8px 0' }} />

            {/* Daily Hours & Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="input-wrapper">
                <label className="input-label">Clinic Start Time</label>
                <select
                  className="input-field"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="08:30 AM">08:30 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                </select>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Clinic End Time</label>
                <select
                  className="input-field"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                </select>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Slot Duration *</label>
                <select
                  className="input-field"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                </select>
              </div>
            </div>

            <div className="divider" style={{ margin: '8px 0' }} />

            {/* Blackout / Unavailable Dates */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Mark Specific Dates as Unavailable (Blackouts)</div>
                  <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
                    Dates when doctor is on leave or clinic is closed
                  </div>
                </div>
              </div>

              {/* Add Blackout Date */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 12, background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label" style={{ fontSize: 11 }}>Date to Block</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newUnavailDate}
                    onChange={(e) => setNewUnavailDate(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1.5 }}>
                  <label className="input-label" style={{ fontSize: 11 }}>Reason / Note</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Leave, Medical Conference, Holiday"
                    value={newUnavailReason}
                    onChange={(e) => setNewUnavailReason(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddUnavailableDate}
                  style={{ height: '36px' }}
                >
                  <Plus size={14} style={{ marginRight: 4 }} /> Add Date
                </Button>
              </div>

              {/* List of currently unavailable dates */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '160px', overflowY: 'auto' }}>
                {unavailableDates.map((item) => (
                  <div
                    key={item.date}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12.5,
                    }}
                  >
                    <div>
                      <strong style={{ color: '#991b1b' }}>{item.date}</strong> &mdash;{' '}
                      <span style={{ color: 'var(--text)' }}>{item.reason}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)', padding: '2px 6px' }}
                      onClick={() => handleRemoveUnavailableDate(item.date)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <CheckCircle size={14} style={{ marginRight: 6 }} />
              Save Availability Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageAvailabilityModal;

