import { useState } from 'react';
import {
  Calendar, Clock, Users, CheckCircle, Save,
  AlertCircle, Plus, ToggleLeft, ToggleRight, Stethoscope
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import { appointments, dummyDoctor, dummyScheduleSlots } from '../../data/dummyData';
import '../../styles/doctor.css';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

function DoctorSchedule() {
  const [availableDays, setAvailableDays] = useState(
    dummyDoctor.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  );
  const [morningStart, setMorningStart] = useState('09:00');
  const [morningEnd, setMorningEnd] = useState('13:00');
  const [afternoonStart, setAfternoonStart] = useState('14:00');
  const [afternoonEnd, setAfternoonEnd] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState('30 mins');
  const [maxPatients, setMaxPatients] = useState('20');
  const [consultationRoom, setConsultationRoom] = useState('Consultation Room 3B (Floor 2)');
  const [savedAlert, setSavedAlert] = useState(false);
  const [slotsList, setSlotsList] = useState(dummyScheduleSlots);

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleToggleSlot = (index) => {
    setSlotsList((prev) =>
      prev.map((slot, i) => {
        if (i === index) {
          if (slot.status === 'available') return { ...slot, status: 'blocked' };
          if (slot.status === 'blocked') return { ...slot, status: 'available' };
        }
        return slot;
      })
    );
  };

  const todayApts = appointments.filter(
    (a) => a.date === '2026-11-07' && a.status !== 'cancelled'
  );

  return (
    <div>
      <PageHeader
        title="Manage Appointment Availability"
        subtitle="Configure your in-person clinic consultation hours, weekly schedule, and slot capacity."
        actions={
          savedAlert ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 600 }}>
              <CheckCircle size={18} /> Availability Updated Successfully
            </div>
          ) : (
            <Button variant="primary" onClick={handleSaveSchedule}>
              <Save size={15} style={{ marginRight: 6 }} />
              Save Availability
            </Button>
          )
        }
      />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Active Consultation Days"
          value={`${availableDays.length} / 7`}
          meta="Days with clinic appointments"
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="Daily Slot Capacity"
          value={maxPatients}
          meta={`Duration: ${slotDuration} per patient`}
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Today's Booked Visits"
          value={todayApts.length.toString()}
          meta="In-person clinical checkups"
          icon={<Users size={18} />}
        />
        <StatCard
          label="Assigned Clinic Room"
          value="Room 3B"
          meta="General Medicine Outpatient Wing"
          icon={<Stethoscope size={18} />}
        />
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Schedule Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Weekly Clinic Working Days</div>
                <div className="card-subtitle">Select the days you are available for in-person consultations</div>
              </div>
            </div>

            <div className="schedule-days-grid" style={{ marginBottom: 16 }}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = availableDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`schedule-day-box${isSelected ? ' selected' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: 13 }}>{day}</span>
                  </div>
                );
              })}
            </div>

            <div className="divider" />

            <div className="card-header" style={{ marginBottom: 12 }}>
              <div>
                <div className="card-title">Daily Working Hours</div>
                <div className="card-subtitle">Set morning and afternoon consultation sessions</div>
              </div>
            </div>

            <form onSubmit={handleSaveSchedule} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Morning Session Start</label>
                  <input
                    type="time"
                    className="input-field"
                    value={morningStart}
                    onChange={(e) => setMorningStart(e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Morning Session End</label>
                  <input
                    type="time"
                    className="input-field"
                    value={morningEnd}
                    onChange={(e) => setMorningEnd(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Afternoon Session Start</label>
                  <input
                    type="time"
                    className="input-field"
                    value={afternoonStart}
                    onChange={(e) => setAfternoonStart(e.target.value)}
                  />
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Afternoon Session End</label>
                  <input
                    type="time"
                    className="input-field"
                    value={afternoonEnd}
                    onChange={(e) => setAfternoonEnd(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Consultation Slot Duration</label>
                  <select
                    className="input-field"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                  >
                    <option value="15 mins">15 mins</option>
                    <option value="20 mins">20 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                  </select>
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Max Patients Per Day</label>
                  <select
                    className="input-field"
                    value={maxPatients}
                    onChange={(e) => setMaxPatients(e.target.value)}
                  >
                    <option value="10">10 patients</option>
                    <option value="15">15 patients</option>
                    <option value="20">20 patients</option>
                    <option value="25">25 patients</option>
                    <option value="30">30 patients</option>
                  </select>
                </div>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Outpatient Consultation Room</label>
                <input
                  type="text"
                  className="input-field"
                  value={consultationRoom}
                  onChange={(e) => setConsultationRoom(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 8 }}>
                <Button type="submit" variant="primary">
                  <Save size={14} style={{ marginRight: 6 }} />
                  Save Schedule Settings
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Today's Slots Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Today's Slot Availability</div>
                <div className="card-subtitle">Click a slot to toggle block / unblock</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {slotsList.map((slot, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: slot.status === 'booked' ? 'var(--primary-light)' : slot.status === 'blocked' ? '#fdf2f2' : 'var(--white)',
                    fontSize: 13,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={14} color="var(--secondary)" />
                    <span style={{ fontWeight: 500 }}>{slot.time}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {slot.status === 'booked' ? (
                      <span className="badge badge-confirmed">
                        {slot.patientName || 'Booked'}
                      </span>
                    ) : slot.status === 'blocked' ? (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--danger)', fontSize: 11.5 }}
                        onClick={() => handleToggleSlot(idx)}
                      >
                        Blocked (Click to Open)
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: 11.5 }}
                        onClick={() => handleToggleSlot(idx)}
                      >
                        Available (Click to Block)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSchedule;

