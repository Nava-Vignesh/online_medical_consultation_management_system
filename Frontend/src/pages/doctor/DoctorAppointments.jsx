import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Search, Filter, Clock, CheckCircle,
  XCircle, Stethoscope, ChevronRight, X, AlertCircle, Phone
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import AppointmentCard from '../../components/doctor/AppointmentCard';
import { appointments as initialAppointments } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointmentsList, setAppointmentsList] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleModalApt, setRescheduleModalApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: appointmentsList.length,
      today: appointmentsList.filter((a) => a.date === '2026-11-07').length,
      confirmed: appointmentsList.filter((a) => a.status === 'confirmed').length,
      pending: appointmentsList.filter((a) => a.status === 'pending').length,
      completed: appointmentsList.filter((a) => a.status === 'completed').length,
      cancelled: appointmentsList.filter((a) => a.status === 'cancelled').length,
    };
  }, [appointmentsList]);

  // Filtered list
  const filteredAppointments = useMemo(() => {
    return appointmentsList.filter((apt) => {
      // Tab filter
      if (activeTab === 'today' && apt.date !== '2026-11-07') return false;
      if (activeTab === 'confirmed' && apt.status !== 'confirmed') return false;
      if (activeTab === 'pending' && apt.status !== 'pending') return false;
      if (activeTab === 'completed' && apt.status !== 'completed') return false;
      if (activeTab === 'cancelled' && apt.status !== 'cancelled') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = apt.patientName.toLowerCase().includes(query);
        const matchSymptoms = apt.symptoms?.toLowerCase().includes(query);
        const matchId = apt.id.toLowerCase().includes(query);
        return matchName || matchSymptoms || matchId;
      }

      return true;
    });
  }, [appointmentsList, activeTab, searchQuery]);

  const handleStatusChange = (id, newStatus) => {
    setAppointmentsList((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleModalApt || !newDate || !newTime) return;

    setAppointmentsList((prev) =>
      prev.map((apt) =>
        apt.id === rescheduleModalApt.id
          ? { ...apt, date: newDate, time: newTime, status: 'confirmed' }
          : apt
      )
    );
    setRescheduleModalApt(null);
    setNewDate('');
    setNewTime('');
  };

  return (
    <div>
      <PageHeader
        title="In-Person Appointments Management"
        subtitle="Review, schedule, and conduct in-person consultations with assigned patients."
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate('/doctor/schedule')}
          >
            <Clock size={15} style={{ marginRight: 6 }} />
            Manage Availability
          </Button>
        }
      />

      {/* Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab${activeTab === 'all' ? ' active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Appointments <span className="tab-badge">{counts.all}</span>
        </button>
        <button
          className={`filter-tab${activeTab === 'today' ? ' active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          Today's Schedule <span className="tab-badge">{counts.today}</span>
        </button>
        <button
          className={`filter-tab${activeTab === 'confirmed' ? ' active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed <span className="tab-badge">{counts.confirmed}</span>
        </button>
        <button
          className={`filter-tab${activeTab === 'pending' ? ' active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approval <span className="tab-badge">{counts.pending}</span>
        </button>
        <button
          className={`filter-tab${activeTab === 'completed' ? ' active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed <span className="tab-badge">{counts.completed}</span>
        </button>
        <button
          className={`filter-tab${activeTab === 'cancelled' ? ' active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled <span className="tab-badge">{counts.cancelled}</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="input-field has-icon"
              placeholder="Search by patient name, chief complaint, or appointment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="card empty-state">
          <Calendar size={42} />
          <div className="empty-state-title">No appointments found</div>
          <div className="empty-state-desc">
            No consultations match the selected filter or search term.
          </div>
          {searchQuery && (
            <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="appointments-grid">
          {filteredAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onStartConsultation={(item) => navigate(`/doctor/consultations?aptId=${item.id}`)}
              onViewDetails={(item) => setSelectedAppointment(item)}
              onReschedule={(item) => setRescheduleModalApt(item)}
              onStatusChange={handleStatusChange}
              onViewRecords={() => navigate('/doctor/prescriptions')}
            />
          ))}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                  Appointment Details &mdash; {selectedAppointment.id}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  {selectedAppointment.date} at {selectedAppointment.time} &bull; {selectedAppointment.room || 'Room 3B'}
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedAppointment(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600 }}>{selectedAppointment.patientName}</h4>
                  <div style={{ fontSize: 12.5, color: 'var(--secondary)' }}>
                    {selectedAppointment.patientAge} years &bull; {selectedAppointment.patientGender}
                  </div>
                </div>
                <Badge
                  status={selectedAppointment.status}
                  label={selectedAppointment.status.toUpperCase()}
                />
              </div>

              <div className="divider" style={{ margin: '8px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)' }}>CONSULTATION TYPE</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{selectedAppointment.type}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)' }}>CONSULTATION ROOM</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{selectedAppointment.room || 'Room 3B (Floor 2)'}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)' }}>CHIEF COMPLAINT &amp; REPORTED SYMPTOMS</div>
                <div style={{ fontSize: 13, background: 'var(--bg)', padding: '10px', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
                  {selectedAppointment.symptoms}
                </div>
              </div>

              {selectedAppointment.vitals && (
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--secondary)', marginBottom: 6 }}>
                    RECORDED VITALS
                  </div>
                  <div className="vitals-summary-chips">
                    <div className="vital-chip">
                      <span className="vital-chip-label">Blood Pressure</span>
                      <span className="vital-chip-value">{selectedAppointment.vitals.bp}</span>
                    </div>
                    <div className="vital-chip">
                      <span className="vital-chip-label">Pulse</span>
                      <span className="vital-chip-value">{selectedAppointment.vitals.pulse}</span>
                    </div>
                    <div className="vital-chip">
                      <span className="vital-chip-label">Body Temp</span>
                      <span className="vital-chip-value">{selectedAppointment.vitals.temp}</span>
                    </div>
                    <div className="vital-chip">
                      <span className="vital-chip-label">Weight</span>
                      <span className="vital-chip-value">{selectedAppointment.vitals.weight || '70 kg'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
              {selectedAppointment.status === 'confirmed' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    const aptId = selectedAppointment.id;
                    setSelectedAppointment(null);
                    navigate(`/doctor/consultations?aptId=${aptId}`);
                  }}
                >
                  <Stethoscope size={14} style={{ marginRight: 6 }} />
                  Start In-Person Consultation
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalApt && (
        <div className="modal-overlay" onClick={() => setRescheduleModalApt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleRescheduleSubmit}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Reschedule Appointment</h3>
                  <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                    Patient: {rescheduleModalApt.patientName} &bull; Currently {rescheduleModalApt.date} at {rescheduleModalApt.time}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setRescheduleModalApt(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div className="input-wrapper">
                  <label className="input-label" htmlFor="new-date">Select New Date *</label>
                  <input
                    id="new-date"
                    type="date"
                    className="input-field"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>

                <div className="input-wrapper">
                  <label className="input-label" htmlFor="new-time">Select New Time Slot *</label>
                  <select
                    id="new-time"
                    className="input-field"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  >
                    <option value="">-- Choose Slot --</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setRescheduleModalApt(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
